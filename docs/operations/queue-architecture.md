# Queue Architecture

BullMQ is configured through `QueueService`.

Queues:

- `email`
- `invoice-pdf`
- `ai`
- `analytics`
- `exports`
- `images`
- `notifications`
- `reminders`

Default job behavior:

- 3 attempts
- exponential backoff
- failed jobs retained
- dead-letter queue entry written on final failure

Long-running work should call `QueueService.add(...)` and register processors with `QueueService.registerWorker(...)`.
