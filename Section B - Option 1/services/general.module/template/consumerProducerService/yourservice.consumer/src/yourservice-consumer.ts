import { YourServiceAggregate } from './domain/aggregates/yourservice-aggregate';
import { DBConfig } from './domain/config/db-config';
import { Config } from './domain/config/config';
import { YourServiceRepository } from './domain/repositories/yourservice-repository';
import Configuration from './configuration.json';
import { ResponseStatus, YourServiceMessage } from '../../yourservice.dto/src';
import MetricsLogger from 'covidscreener-metricslogger';
import { YourServiceDataModel } from './domain/models/yourservice-datamodel';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';
import { ObjectID } from 'mongodb';
import { MessageBusConfig } from './domain/config/message-bus-config';
import MessageBus from 'covidscreener-messagebus';
import { ProcessStatus } from 'covidscreener-messagebus/dist/domain/models/process-status';

export class YourServiceConsumer{
    private aggregate: YourServiceAggregate;
    private isStopping: boolean;
    private isConsuming: boolean;
    private config: Config;
    private metricsLogger: MetricsLogger;
    private messageBus: MessageBus;

    constructor() {
        const databaseConfig = new DBConfig(
            Configuration.databaseConfig.databaseName,
            Configuration.databaseConfig.collectionName,
            Configuration.databaseConfig.connectionString
        );

        const messageBusConfig = new MessageBusConfig(
            Configuration.messageBus.connectionString,
            Configuration.messageBus.topic
        );

        this.config = new Config(messageBusConfig, databaseConfig);
        const repository = new YourServiceRepository(this.config);
        this.aggregate = new YourServiceAggregate(repository);
        this.metricsLogger = new MetricsLogger(Configuration, false);
        this.messageBus = new MessageBus(this.config.messageBusConfig.connectionString);
    }

    async consumeAsync(id: ObjectID, message: YourServiceMessage<YourServiceDataModel>): Promise<number> {
        try {
            this.isConsuming = true;

            const result = await this.aggregate.doAsync(message);

            this.isConsuming = false;

            if (result.status === ResponseStatus.failure) {

                if (result.status === 400) {
                    this.messageBus.commit(id, ProcessStatus.failed, true);
                } else {
                    this.messageBus.commit(id, ProcessStatus.failed, false);
                }

                return result.code;
            } else {
                this.messageBus.commit(id, ProcessStatus.complete, true);
                return 200;
            }
        } catch (ex) {
            const ERROR_MESSAGE = 'Error occurred while consuming message in YourService consumer';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            this.messageBus.commit(id, ProcessStatus.failed, false);
        }
    }

    async start() {
        try {
            // tslint:disable-next-line:no-console
            console.log('\nStarting');
            let droppedMessagesBusy = true;

            while (droppedMessagesBusy && !this.isStopping) {
                const messageObject = await this.messageBus.consume(this.config.messageBusConfig.topic, ProcessStatus.processing);

                if (messageObject && messageObject.content) {

                    const message = JSON.parse(messageObject.content)
                    message.id = new ObjectID(message.id);
                    await this.metricsLogger.processMetrics(this.consumeAsync(messageObject._id, message));
                } else {

                    droppedMessagesBusy = false;
                }
            }

            while (!this.isStopping) {

                const messageObject = await this.messageBus.consume(this.config.messageBusConfig.topic, ProcessStatus.new);

                if (messageObject && messageObject.content) {

                    const message = JSON.parse(messageObject.content)
                    message.id = new ObjectID(message.id);
                    await this.metricsLogger.processMetrics(this.consumeAsync(messageObject._id, message));
                } else {
                    await this.sleep(10000);
                }
            }

            if (this.isStopping) {
                this.stop();
            }
        } catch (ex) {
            const ERROR_MESSAGE = `Error occurred while consuming message: ${ex}`;
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);
        }
    }

    stop() {

        // tslint:disable-next-line:no-console
        console.log('\n\nStop signal received');
        process.exit(0);
    }

    requestStop() {
        if (!this.isStopping) {
            this.isStopping = true;
            if (!this.isConsuming) {
                this.stop();
            }
        }
    }

    sleep(ms: number) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }
}
