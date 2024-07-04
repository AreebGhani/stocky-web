import { useState, useEffect } from 'react';

type Props = {
    initialMinute?: number;
    initialSeconds?: number;
    onTimerEnd: () => void;
}

const Timer = (props: Props) => {
    const { initialMinute = 0, initialSeconds = 0, onTimerEnd } = props;
    const [minutes, setMinutes] = useState<number>(initialMinute);
    const [seconds, setSeconds] = useState<number>(initialSeconds);
    useEffect(() => {
        let myInterval = setInterval(() => {
            if (seconds > 0) {
                setSeconds(seconds - 1);
            }
            if (seconds === 0) {
                if (minutes === 0) {
                    clearInterval(myInterval)
                } else {
                    setMinutes(minutes - 1);
                    setSeconds(59);
                }
            }
        }, 1000)
        return () => {
            clearInterval(myInterval);
        };
    });

    useEffect(() => {
        if (minutes === 0 && seconds === 0) {
            onTimerEnd();
        }
    }, [minutes, seconds, onTimerEnd]);

    const formatTime = (value: number) => (value < 10 ? `0${value}` : `${value}`);

    const getQuotient = (value: number) => Math.floor(value / 60);
    const getRemainder = (value: number) => value % 60;

    return (
        <>
            {`${formatTime(getQuotient(minutes))}:${formatTime(getRemainder(minutes))}:${formatTime(seconds)}`}
        </>
    );
}

export default Timer;
