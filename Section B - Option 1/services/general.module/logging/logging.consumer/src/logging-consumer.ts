import { ILoggingConsumer } from './ilogging-consumer';
import { LoggingAggregate } from './domain/aggregates/logging-aggregate';
import { DBConfig } from './domain/config/db-config';
import { Config } from './domain/config/config';
import { LoggingRepository } from './domain/repositories/logging-repository';
import Configuration from './configuration.json';
import { ResponseStatus, LoggingMessage } from '../../logging.dto/src';
import MetricsLogger from 'covidscreener-metricslogger';
import { LoggingDataModel } from './domain/models/logging-datamodel';
import { ObjectID } from 'mongodb';
import MessageBus from 'covidscreener-messagebus';
import { ProcessStatus } from 'covidscreener-messagebus/dist/domain/models/process-status';

export class LoggingConsumer implements ILoggingConsumer {
    private aggregate: LoggingAggregate;
    private isStopping: boolean;
    private isConsuming: boolean;
    private config: Config;
    private metricsLogger: MetricsLogger;
    private messageBus: MessageBus;

    constructor() {
        const databaseConfig = new DBConfig(Configuration.databaseConfig);
        this.config = new Config(databaseConfig, Configuration.topic);
        const repository = new LoggingRepository(this.config);
        this.aggregate = new LoggingAggregate(repository);
        this.metricsLogger = new MetricsLogger(Configuration, false);
        this.messageBus = new MessageBus(this.config.databaseConfig.connectionString);
    }

    async consumeAsync(id: ObjectID, message: LoggingMessage<LoggingDataModel>): Promise<number> {
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
            const ERROR_MESSAGE = 'Error occurred while consuming message in Logging consumer';
            // tslint:disable-next-line:no-console
            console.log(ERROR_MESSAGE);
        }
    }

    async start() {
        try {
            // tslint:disable-next-line:no-console
            console.log('\nStarting');
            let droppedMessagesBusy = true;

            while (droppedMessagesBusy && !this.isStopping) {
                const messageObject = await this.messageBus.consume(this.config.topic, ProcessStatus.processing);

                if (messageObject && messageObject.content) {

                    const message = JSON.parse(messageObject.content)
                    message.id = new ObjectID(message.id);
                    await this.metricsLogger.processMetrics(this.consumeAsync(messageObject._id, message));
                } else {

                    droppedMessagesBusy = false;
                }
            }

            while (!this.isStopping) {

                const messageObject = await this.messageBus.consume(this.config.topic, ProcessStatus.new);

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
            // tslint:disable-next-line:no-console
            console.log(`Error occurred while consuming message: ${ex}`);
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
