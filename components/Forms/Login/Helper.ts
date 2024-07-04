import z from 'zod';
import { Field } from "@/types/types";
import { PhoneNumberUtil } from 'google-libphonenumber';

const phoneUtil = PhoneNumberUtil.getInstance();

export const isPhoneValid = (phone: string) => {
    try {
        return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
    } catch (error) {
        return false;
    }
};

export const EmailFields: Field[] = [
    { type: 'text', name: 'email', placeholder: 'Email', icon: '/svg/email.svg', width: 18, height: 18 },
    { type: 'password', name: 'password', placeholder: 'Password', icon: '/svg/lock.svg', width: 24, height: 24 },
];

export const PhoneFields: Field[] = [
    { type: 'number', name: 'phone', placeholder: 'Number', icon: '/svg/phone.svg', width: 24, height: 24 },
    { type: 'password', name: 'password', placeholder: 'Password', icon: '/svg/lock.svg', width: 24, height: 24 },
];

const EmailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

export const LoginSchema = z.object({
    phone: z.string().optional(),
    email: z.string().optional().refine((email) => !email || EmailRegex.test(email), {
        message: 'Invalid email',
    }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    checkbox: z.boolean().optional(),
}).superRefine((values, ctx) => {
    if(values.phone && values.phone.length < 5) {
        values.phone = '';
    }
    if (!values.phone && !values.email) {
        ctx.addIssue({
            message: 'Either phone or email should be filled in.',
            code: z.ZodIssueCode.custom,
            path: ['email'],
        });
        ctx.addIssue({
            message: 'Either phone or email should be filled in.',
            code: z.ZodIssueCode.custom,
            path: ['phone'],
        });
    } else if (values.phone && values.email) {
        ctx.addIssue({
            message: 'Provide either phone or email, not both.',
            code: z.ZodIssueCode.custom,
            path: ['email'],
        });
        ctx.addIssue({
            message: 'Provide either phone or email, not both.',
            code: z.ZodIssueCode.custom,
            path: ['phone'],
        });
    }
}).refine((data) => {
    if (data.email && data.email !== '' && data.phone === '') {
        return EmailRegex.test(data.email);
    }
    return true;
}, {
    message: 'Invalid email',
    path: ['email'],
}).refine((data) => {
    if (data.phone && data.phone !== '' && data.email === '') {
        return isPhoneValid(data.phone);
    }
    return true;
}, {
    message: 'Invalid number',
    path: ['phone'],
});
