curl --location --request POST 'https://chat.googleapis.com/v1/spaces/AAAABYga7do/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=PAqgc4TJ8SlMwVo14LsdYFUrg8J38EEiVsDd0vtJkuQ%3D' \
--header 'Content-Type: application/json' \
--data-raw '    {
      "text": "❌ *Deployment Failed!*\n\nHost: Staging\n\nService: CandidateInteractionAPI\n\nThe release has been canceled!"
    }'