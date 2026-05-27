export declare const sendEmail: (body: {
    to: string;
    subject: string;
    html: string;
}) => Promise<void>;
