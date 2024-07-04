import { useEffect, useState } from 'react';
import Image from '@/utils/Image'
import Link from 'next/link';
import z from "zod";
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import styles from "@/components/Forms/styles.module.css";
import { zodResolver } from '@hookform/resolvers/zod';
import { EmailFields, PhoneFields, LoginSchema } from '@/components/Forms/Login/Helper';
import { Field, LoginEmail, LoginPhone } from '@/types/types';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { Login } from '@/server/actions/Login';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useAuth } from '@/contexts/authContext';

type Props = {
    loginWith: 'email' | 'phone',
}

const LoginForm = ({ loginWith }: Props) => {
    const { verifyLogin } = useAuth();
    const [btnText, setBtnText] = useState<string>("Next");
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [recaptchaValue, setRecaptchaValue] = useState<string>("1");

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    }

    const handleFocus = () => {
        setShowPassword(false);
        setIsFocused(true);
    };

    const handleBlur = () => {
        setShowPassword(false);
        setIsFocused(false);
    };

    const router = useRouter();

    let Inputs: LoginEmail | LoginPhone;
    let Fields: Field[] = [];

    if (loginWith === 'email') {
        Fields = EmailFields;
    } else if (loginWith === 'phone') {
        Fields = PhoneFields;
    } else {
        throw new Error('Invalid loginWith value');
    }

    type LoginSchema = z.infer<typeof LoginSchema>;

    const { register, handleSubmit, control, setValue, formState: { errors, isSubmitting, isSubmitSuccessful }, reset, setError } = useForm<LoginSchema>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {},
    });

    const onSubmit: SubmitHandler<LoginSchema> = async (data: LoginSchema) => {
        setShowPassword(false);
        setIsFocused(false);
        if (loginWith === 'email') {
            data.phone = 'null';
            const res: { success: boolean; error?: { key: string; message: string; }; data?: { token: string } } = await Login(data);
            if (res.success && res.data) {
                reset();
                Cookies.set('session', res.data.token, { expires: data.checkbox ? 7 : 1 });
                Cookies.set('session-expires', data.checkbox ? "7" : "1", { expires: data.checkbox ? 7 : 1 });
                if (Cookies.get('session')) {
                    verifyLogin();
                    router.replace('/dashboard');
                } else {
                    window.location.reload();
                }
            } else {
                if (res.error && res.error.key && res.error.message) {
                    setError(res.error.key as keyof LoginSchema, { message: res.error.message });
                }
            }
        } else if (loginWith === 'phone') {
            data.email = 'null';
            const res: { success: boolean; error?: { key: string; message: string; }; data?: { token: string } } = await Login(data);
            if (res.success && res.data) {
                reset();
                Cookies.set('session', res.data.token, { expires: data.checkbox ? 7 : 1 });
                Cookies.set('session-expires', data.checkbox ? "7" : "1", { expires: data.checkbox ? 7 : 1 });
                if (Cookies.get('session')) {
                    verifyLogin();
                    router.replace('/dashboard');
                } else {
                    window.location.reload();
                }
            } else {
                if (res.error && res.error.key && res.error.message) {
                    setError(res.error.key as keyof LoginSchema, { message: res.error.message });
                }
            }
        } else {
            throw new Error('Invalid loginWith value');
        }
    };

    useEffect(() => {
        if (loginWith === 'email') {
            reset({ phone: '' });
        } else {
            reset({ email: '' });
        }
    }, [loginWith, reset]);

    useEffect(() => {
        if (isSubmitting || isSubmitSuccessful) {
            setBtnText('Loading...');
        } else {
            setBtnText('Next');
        }
    }, [isSubmitting, isSubmitSuccessful, loginWith]);

    useEffect(() => {
        setTimeout(() => setRecaptchaValue(""), 1000);
    }, []);

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className={`${(isSubmitting || isSubmitSuccessful) && 'animate-pulse'}`}>
                <div className="transition-transform duration-500 ease-in-out delay-0">
                    <div className={`transition-transform duration-500 ease-in-out delay-0 transform ${loginWith === 'email' ? 'translate-x-0' : '-translate-x-full'}`} >
                        {loginWith === 'email' && Fields?.map((field: Field, i: number) => (
                            <div key={i} className='mb-4'>
                                {field.name === 'password' ?
                                    <> <div className={`relative ${(isSubmitting || isSubmitSuccessful) && styles.disabled}`}>
                                        <input
                                            type={showPassword ? 'text' : field.type}
                                            className={`w-full px-3 py-2 focus:outline-none pr-10 ${styles.input} ${(isSubmitting || isSubmitSuccessful) && styles.disabled}`}
                                            placeholder={field.placeholder}
                                            {...register(field.name as keyof typeof Inputs)}
                                            onFocus={handleFocus}
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                            {isFocused ?
                                                <Image
                                                    className='cursor-pointer'
                                                    src={showPassword ? '/svg/eye.svg' : '/svg/eye-slash.svg'}
                                                    alt={field.name}
                                                    width={25}
                                                    height={showPassword ? 25 : 20}
                                                    onClick={toggleShowPassword}
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
                                        {errors[field.name as keyof typeof Inputs] && (
                                            <p className="text-red-600 text-[14px]">
                                                {errors[field.name as keyof typeof Inputs]?.message}
                                            </p>
                                        )}
                                    </> : <>
                                        <div className={`relative ${(isSubmitting || isSubmitSuccessful) && styles.disabled}`}>
                                            <input
                                                type={field.type}
                                                className={`w-full px-3 py-2 focus:outline-none pr-10 ${styles.input} ${(isSubmitting || isSubmitSuccessful) && styles.disabled}`}
                                                placeholder={field.placeholder}
                                                {...register(field.name as keyof typeof Inputs)}
                                                onFocus={handleBlur}
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
                                    </>}
                            </div>
                        ))}
                    </div>
                    <div className={`transition-transform duration-500 ease-in-out delay-0 transform ${loginWith === 'phone' ? 'translate-x-0' : 'translate-x-full'}`}>
                        {loginWith === 'phone' && Fields?.map((field: Field, i: number) => (
                            <div key={i} className='mb-4'>
                                {field.name === 'password' ?
                                    <> <div className={`relative ${(isSubmitting || isSubmitSuccessful) && styles.disabled}`}>
                                        <input
                                            type={showPassword ? 'text' : field.type}
                                            className={`w-full px-3 py-2 focus:outline-none pr-10 ${styles.input} ${(isSubmitting || isSubmitSuccessful) && styles.disabled}`}
                                            placeholder={field.placeholder}
                                            {...register(field.name as keyof typeof Inputs)}
                                            onFocus={handleFocus}
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                            {isFocused ?
                                                <Image
                                                    className='cursor-pointer'
                                                    src={showPassword ? '/svg/eye.svg' : '/svg/eye-slash.svg'}
                                                    alt={field.name}
                                                    width={25}
                                                    height={showPassword ? 25 : 20}
                                                    onClick={toggleShowPassword}
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
                                        {errors[field.name as keyof typeof Inputs] && (
                                            <p className="text-red-600 text-[14px]">
                                                {errors[field.name as keyof typeof Inputs]?.message}
                                            </p>
                                        )}
                                    </> :
                                    <>
                                        {field.name === 'phone' ?
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
                                                                inputProps={{ name: field.name, onFocus: handleBlur, required: true }}
                                                                onChange={(value) => {
                                                                    field.onChange(value);
                                                                    setValue('phone', value);
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
                                            </> :
                                            <><div className={`relative ${(isSubmitting || isSubmitSuccessful) && styles.disabled}`}>
                                                <input
                                                    type={field.type}
                                                    className={`w-full px-3 py-2 focus:outline-none pr-10 ${styles.input} ${(isSubmitting || isSubmitSuccessful) && styles.disabled}`}
                                                    placeholder={field.placeholder}
                                                    {...register(field.name as keyof typeof Inputs)}
                                                    onFocus={handleBlur}
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
                                        }
                                    </>}
                            </div>
                        ))}
                    </div>
                </div>
                <div className={`flex items-center justify-between mt-4 mb-12 font-[Arial] font-normal text-[9px] ${(isSubmitting || isSubmitSuccessful) && styles.disabled}`}>
                    <span className="flex items-center justify-center">
                        <input className={`${styles.checkbox} ${(isSubmitting || isSubmitSuccessful) && styles.disabled}`} disabled={(isSubmitting || isSubmitSuccessful)} id="checkbox" type="checkbox" {...register('checkbox', { required: false })} />
                        <label htmlFor="checkbox" className={`text-[#fff] ml-1 ${(isSubmitting || isSubmitSuccessful) ? styles.disabled : 'cursor-pointer'}`}>Remember Me</label>
                    </span>
                    <Link href="/forgot" className="text-[#FFC60A] cursor-pointer">Forgot Password?</Link>
                </div>
                <button disabled={(isSubmitting || isSubmitSuccessful)} type="submit" className={`w-full custom-button ${(isSubmitting || isSubmitSuccessful) && 'disabled'}`}>
                    {btnText} <Image className={`${(isSubmitting || isSubmitSuccessful) ? 'hidden' : 'ml-2'}`} src="/svg/arrow-right.svg" alt="next" width={8} height={14} />
                </button>
            </form>
        </>
    )
}

export default LoginForm
