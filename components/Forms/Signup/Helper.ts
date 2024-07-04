import z from 'zod';
import { Field } from "@/types/types";
import { isPhoneValid } from '@/components/Forms/Login/Helper';

export const EmailFields: Field[] = [
    { type: 'text', name: 'username', placeholder: 'Username', icon: '/svg/user.svg', width: 24, height: 24 },
    { type: 'text', name: 'email', placeholder: 'Email', icon: '/svg/email.svg', width: 18, height: 18 },
    { type: 'password', name: 'password', placeholder: 'Strong Password', icon: '/svg/lock.svg', width: 24, height: 24 },
    { type: 'password', name: 'confirmPassword', placeholder: 'Re-enter Password', icon: '/svg/lock.svg', width: 24, height: 24 },
    { type: 'text', name: 'referral', placeholder: 'Referral (Optional)', icon: '/svg/referral.svg', width: 18, height: 21 },
];

export const PhoneFields = [
    { type: 'text', name: 'username', placeholder: 'Username', icon: '/svg/user.svg', width: 24, height: 24 },
    { type: 'text', name: 'phone', placeholder: 'Number', icon: '/svg/phone.svg', width: 24, height: 24 },
    { type: 'password', name: 'password', placeholder: 'Strong Password', icon: '/svg/lock.svg', width: 24, height: 24 },
    { type: 'password', name: 'confirmPassword', placeholder: 'Re-enter Password', icon: '/svg/lock.svg', width: 24, height: 24 },
    { type: 'text', name: 'referral', placeholder: 'Referral (Optional)', icon: '/svg/referral.svg', width: 18, height: 21 },
]

const letterNumber = /^[a-zA-Z0-9]{6,20}$/;
const EmailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

export const SignupSchema = z.object({
    username: z.string().refine((username) => letterNumber.test(username), { message: 'Atleast 6 characters that must contain letters and numbers' }),
    phone: z.string().optional(),
    email: z.string().optional().refine((email) => !email || EmailRegex.test(email), {
        message: 'Invalid email',
    }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: z.string().min(6, { message: 'Passwords do not match' }),
    referral: z.string().optional().refine((referral) => !referral || letterNumber.test(referral), {
        message: 'Atleast 6 characters that must contain letters and numbers',
    }),
    checkbox: z.boolean().refine((checkbox) => checkbox === true, {
        message: 'Please agree to proceed',
    }),
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
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});
