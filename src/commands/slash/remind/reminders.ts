interface RemindDetail {
    userId: string;
    timer: Timer;
    end: number;
}

const reminders = new Map<string, RemindDetail>();
export default reminders;
