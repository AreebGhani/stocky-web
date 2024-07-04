"use client"
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/app/(app)/account/password/loading";
import Link from "next/link";
import Image from "@/utils/Image";
import { Field, sessionData } from "@/types/types";
import z from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "@/components/Forms/styles.module.css";
import { ResetPassword } from "@/server/actions/ResetPassword";
import { useAuth } from "@/contexts/authContext";

const Password: NextPage = () => {
    const router = useRouter();
    const { sessionStatus, session } = useAuth();

    const [btnText, setBtnText] = useState<string>("Save");
    const [user, setUser] = useState<sessionData>();
    const [resetErrors, setResetErrors] = useState<string>("");
    const [focusedInput, setFocusedInput] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState<{ field: string, show: boolean }>({ field: '', show: false });
    const [eye, setEye] = useState<string>("/svg/eye-slash.svg");

    useEffect(() => {
        if (sessionStatus !== "loading" && sessionStatus !== "authenticated") {
            router.replace("/login");
        } else {
            if (session) {
                setUser(session as sessionData);
            }
        }
    }, [sessionStatus, router, session]);

    const eyeToggle = () => {
        setEye((previous) => {
            if (previous === '/svg/eye.svg') {
                return '/svg/eye-slash.svg';
            }
            if (previous === '/svg/eye-slash.svg') {
                return '/svg/eye.svg';
            }
            return previous;
        });
    }

    const toggleShowPassword = (fieldName: string) => {
        eyeToggle();
        setShowPassword((previous) => {
            return {
                field: fieldName,
                show: !previous.show,
            }
        });
    };

    const handleFocus = (fieldName: string) => {
        setEye("/svg/eye-slash.svg");
        setShowPassword({ field: fieldName, show: false });
        setFocusedInput(fieldName);
    };

    type Inputs = {
        password: string;
        confirmPassword: string;
    };

    const ResetFields: Field[] = [
        { type: 'password', name: 'oldPassword', placeholder: 'Password', icon: '/svg/lock.svg', width: 24, height: 24, label: 'Enter Old Password' },
        { type: 'password', name: 'password', placeholder: 'Password', icon: '/svg/lock.svg', width: 24, height: 24, label: 'Enter New Password' },
        { type: 'password', name: 'confirmPassword', placeholder: 'Password', icon: '/svg/lock.svg', width: 24, height: 24, label: 'Confirm Password' },
    ]

    const ResetSchema = z.object({
        oldPassword: z.string().min(6, { message: 'Password must be at least 6 characters' }),
        password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
        confirmPassword: z.string().min(6, { message: 'Passwords do not match' }),
    }).refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

    type ResetSchema = z.infer<typeof ResetSchema>;

    const { register, handleSubmit, formState: { errors, isSubmitting, isSubmitSuccessful }, reset, setError } = useForm<ResetSchema>({
        resolver: zodResolver(ResetSchema),
        defaultValues: {},
    });

    const onSubmit: SubmitHandler<ResetSchema> = async (data: ResetSchema) => {
        setShowPassword({ field: 'password', show: false });
        setEye("/svg/eye-slash.svg");
        setFocusedInput(null);
        setResetErrors("");
        setShowPassword({ field: 'confirmPassword', show: false });
        const res: { success: boolean, message: string } = await ResetPassword(data.password, undefined, user?.user.id, data.oldPassword);
        if (res.success) {
            reset();
            router.replace('/dashboard');
        } else {
            if (res.message === "Wrong Password") {
                setError("oldPassword", { message: res.message });
            } else {
                setResetErrors(res.message);
            }
        }
    }

    useEffect(() => {
        if (isSubmitting || isSubmitSuccessful) {
            setBtnText('Loading...');
        } else {
            setBtnText('Save');
        }
    }, [isSubmitting, isSubmitSuccessful]);

    if (sessionStatus === "loading") {
        return <Loading />;
    }

    return (
        sessionStatus === "authenticated" && (
            <div className="flex min-h-screen flex-col items-center justify-start md:justify-center pt-8 md:p-24">
                <div className="px-4 md:p-8 md:rounded-[4rem] md:shadow-lg md:border-2 md:border-[rgba(40,50,68)] w-full md:w-96">
                    <div className="ml-2 mt-2 md:mt-0">
                        <Link href='/account' className="w-10 block">
                            <Image src="/svg/goback.svg" alt="goback" width={49} height={49} />
                        </Link>
                    </div>
                    <div className="mt-12 mx-4">
                        <form onSubmit={handleSubmit(onSubmit)} className={`${(isSubmitting || isSubmitSuccessful) && 'animate-pulse'}`}>
                            {ResetFields?.map((field: Field, i: number) => (
                                <div key={i} className='mb-4'>
                                    <label className="text-[16px] text-[#fff] font-semibold">{field.label}</label>
                                    <div className={`relative mt-1 ${(isSubmitting || isSubmitSuccessful) && styles.disabled}`}>
                                        <input
                                            type={showPassword.field === field.name ? showPassword.show ? 'text' : field.type : field.type}
                                            className={`w-full px-3 py-2 focus:outline-none pr-10 ${styles.input} ${(isSubmitting || isSubmitSuccessful) && styles.disabled}`}
                                            placeholder={field.placeholder}
                                            {...register(field.name as keyof Inputs)}
                                            onFocus={() => handleFocus(field.name)}
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                            {focusedInput === field.name ?
                                                <Image
                                                    className="cursor-pointer"
                                                    src={eye}
                                                    alt={field.name}
                                                    width={25}
                                                    height={eye === '/svg/eye.svg' ? 25 : 20}
                                                    onClick={() => toggleShowPassword(field.name)}
                                                /> :
                                                <Image
                                                    src={field.icon}
                                                    alt={field.name}
                                                    width={field.width}
                                                    height={field.height}
                                                />
                                            }
                                        </div>
                                    </div>
                                    {errors[field.name as keyof Inputs] && (
                                        <p className="text-red-600 text-[14px]">
                                            {errors[field.name as keyof Inputs]?.message}
                                        </p>
                                    )}
                                </div>
                            ))}
                            {resetErrors !== "" && <p className="text-red-600 text-[14px] mt-2 mb-4 text-center"> {resetErrors} </p>}
                            <div className="flex justify-center items-center mt-8">
                                <button disabled={(isSubmitting || isSubmitSuccessful)} type="submit" className={`w-1/3 custom-button ${(isSubmitting || isSubmitSuccessful) && 'disabled'}`}>
                                    {btnText} <Image className={`${(isSubmitting || isSubmitSuccessful) ? 'hidden' : 'ml-2'}`} src="/svg/arrow-right.svg" alt="next" width={8} height={14} />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    );
};

export default Password;
