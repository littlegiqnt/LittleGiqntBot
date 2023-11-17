interface RemindDetail {
    userId: string
    timeout: NodeJS.Timeout
    end: number
}

const reminders = new Map<string, RemindDetail>();
export default reminders;
