import { useEffect, useState } from 'react';
import Image from '@/utils/Image';
import z from "zod";
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import styles from "@/components/Forms/styles.module.css";
import { ForgotPassword } from "@/server/actions/ForgotPassword";
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { useRouter } from "next/navigation";
import { Field } from "@/types/types";
import { EmailFields, PhoneFields, ForgotSchema } from "@/components/Forms/Forgot/Helper";
import ReCAPTCHA from "react-google-recaptcha";
import { CheckRecaptcha } from '@/server/actions/CheckRecaptcha';

type Props = {
    forgotWith: 'email' | 'phone',
};

const ForgotForm = ({ forgotWith }: Props) => {
    const router = useRouter();

    const [btnText, setBtnText] = useState<string>("Next");
    const [recaptchaValue, setRecaptchaValue] = useState<string>("1");
    const [recaptchaError, setRecaptchaError] = useState<string>("");

    let Inputs: { phone: string, email: string };
    let Fields: Field[] = [];

    if (forgotWith === 'email') {
        Fields = EmailFields;
    } else if (forgotWith === 'phone') {
        Fields = PhoneFields;
    } else {
        throw new Error('Invalid forgotWith value');
    }

    type ForgotSchema = z.infer<typeof ForgotSchema>;

    const { register, handleSubmit, control, setValue, formState: { errors, isSubmitting, isSubmitSuccessful }, reset, setError } = useForm<ForgotSchema>({
        resolver: zodResolver(ForgotSchema),
        defaultValues: {},
    });

    const onSubmit: SubmitHandler<ForgotSchema> = async (data: ForgotSchema) => {
        if (forgotWith === 'email') {
            const res: { success: boolean, message?: string, token?: string } = await ForgotPassword(forgotWith, data.email as string);
            if (res.success) {
                reset();
                localStorage.setItem("temp", JSON.stringify({ method: forgotWith, email: data.email, token: res.token }));
                router.replace('/verify?from=/login&callback=/reset');
            } else {
                setError("email", { message: res.message });
            }
        } else if (forgotWith === 'phone') {
            const res: { success: boolean, message?: string, token?: string } = await ForgotPassword(forgotWith, data.phone as string);
            if (res.success) {
                reset();
                localStorage.setItem("temp", JSON.stringify({ method: forgotWith, phone: data.email, token: res.token }));
                router.replace('/verify?from=/login&callback=/reset');
            } else {
                setError("phone", { message: res.message });
            }
        } else {
            throw new Error('Invalid forgotWith value');
        }
    }

    useEffect(() => {
        if (forgotWith === 'email') {
            reset({ phone: '' });
        } else {
            reset({ email: '' });
        }
    }, [forgotWith, reset]);

    useEffect(() => {
        if (isSubmitting || isSubmitSuccessful) {
            setBtnText('Loading...');
        } else {
            setBtnText('Next');
        }
    }, [isSubmitting, isSubmitSuccessful, forgotWith]);

    useEffect(() => {
        setTimeout(() => setRecaptchaValue(""), 1000);
    }, []);

    const onChangeRecaptcha = async (value: string | null) => {
        if (value) {
            setRecaptchaValue(value);
            try {
                const response = await CheckRecaptcha(value);
                if (!response.success) {
                    setRecaptchaValue("");
                    setRecaptchaError("Error while checking reCAPTCHA");
                }
            } catch (error) {
                setRecaptchaValue("");
                setRecaptchaError("Error while checking reCAPTCHA");
            }
        } else {
            setRecaptchaValue("");
            setRecaptchaError("Please confirm that you are not a robot");
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className={`${(isSubmitting || isSubmitSuccessful) && 'animate-pulse'}`}>
                <div className="transition-transform duration-500 ease-in-out">
                    <div className={`transition-transform duration-500 ease-in-out transform ${forgotWith === 'email' ? 'translate-x-0' : '-translate-x-full'}`} >
                        {forgotWith === 'email' && Fields?.map((field: Field, i: number) => (
                            <div key={i} className='mb-4'>
                                <div className={`relative ${(isSubmitting || isSubmitSuccessful) && styles.disabled}`}>
                                    <input
                                        type={field.type}
                                        className={`w-full px-3 py-2 focus:outline-none pr-10 ${styles.input} ${(isSubmitting || isSubmitSuccessful) && styles.disabled}`}
                                        placeholder={field.placeholder}
                                        {...register(field.name as keyof typeof Inputs)}
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <Image
                                            src={field.icon}
                                            alt={field.name}
                                            width={field.width}
                                            height={field.height}
                                        />
                                    </div>
                                </div>
                                {errors[field.name as keyof typeof Inputs] && (
                                    <p className="text-red-600 text-[14px]">
                                        {errors[field.name as keyof typeof Inputs]?.message}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className={`transition-transform duration-500 ease-in-out transform ${forgotWith === 'phone' ? 'translate-x-0' : 'translate-x-full'}`}>
                        {forgotWith === 'phone' && Fields?.map((field: Field, i: number) => (
                            <div key={i} className='mb-4'>
                                {field.name == 'phone' && (
                                    <>
                                        <div className={`relative ${(isSubmitting || isSubmitSuccessful) && styles.disabled}`}>
                                            <Controller
                                                name={field.name}
                                                control={control}
                                                render={({ field }) => (
                                                    <PhoneInput
                                                        defaultCountry={"pk"}
                                                        className={`phoneDropdown ${(isSubmitting || isSubmitSuccessful) && styles.disabled}`}
                                                        inputClassName={`px-3 py-2 w-full focus:outline-none pr-10 rounded-r-[10px] ${styles.inputNumber} ${(isSubmitting || isSubmitSuccessful) && styles.disabled}`}
                                                        countrySelectorStyleProps={{ "buttonContentWrapperClassName": `mx-2` }}
                                                        inputProps={{ name: field.name, required: true }}
                                                        onChange={(value) => {
                                                            field.onChange(value)
                                                            setValue('phone', value)
                                                        }}
                                                    />
                                                )}
                                            />
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                <Image
                                                    src={field.icon}
                                                    alt={field.name}
                                                    width={field.width}
                                                    height={field.height}
                                                />
                                            </div>
                                        </div>
                                        {errors[field.name as keyof typeof Inputs] && (
                                            <p className="text-red-600 text-[14px]">
                                                {errors[field.name as keyof typeof Inputs]?.message}
                                            </p>
                                        )}
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                    <button disabled={(isSubmitting || isSubmitSuccessful)} type="submit" className={`w-full custom-button ${(isSubmitting || isSubmitSuccessful) && 'disabled'}`}>
                        {btnText} <Image className={`${(isSubmitting || isSubmitSuccessful) ? 'hidden' : 'ml-2'}`} src="/svg/arrow-right.svg" alt="next" width={8} height={14} />
                    </button>
            </form>
        </>
    );
};

export default ForgotForm;
