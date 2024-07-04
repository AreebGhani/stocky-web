"use client"
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "@/utils/Image";
import Loading from "@/app/(app)/market/buy/loading";
import Link from "next/link";
import { sessionData } from "@/types/types";
import { BuyStock } from "@/server/actions/BuyStock";
import { GetBalance } from "@/server/actions/GetBalance";
import { GetStockPrice } from "@/server/actions/GetStockPrice";
import { useAuth } from "@/contexts/authContext";

const Buy: NextPage = () => {
  const [stockCost, setStockCost] = useState<{ balance: number, diamonds: number }>({ balance: 0, diamonds: 0 });
  const router = useRouter();
  const params = useParams();
  const { id, stock } = params;
  const { sessionStatus, session } = useAuth();
  const [user, setUser] = useState<sessionData>();
  const [quantity, setQuantity] = useState<number>(1);
  const [userBalance, setUserBalance] = useState<{ balance: number, diamonds: number }>({ balance: 0, diamonds: 0 });
  const [remaining, setRemaining] = useState<{ balance: number, diamonds: number }>({ balance: 0, diamonds: 0 });
  const [balanceLoading, setBalanceLoading] = useState<boolean>(true);
  const [useDiamond, setUseDiamond] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (sessionStatus !== "loading" && sessionStatus !== "authenticated") {
      router.replace("/login");
    }
    if (id === undefined) {
      router.replace("/market");
    }
    if (!(stock === 'daily-stocks' || stock === 'long-term-stocks')) {
      router.replace("/market");
    }
    if (session) {
      setUser(session as sessionData);
    }
    const fetchStockCost = async () => {
      const res: { success: boolean; data?: { balance: number, diamonds: number }; message?: string } = await GetStockPrice();
      if (res.success && res.data) {
        if (stock === 'long-term-stocks') {
          setStockCost({ balance: (res.data.balance * 10), diamonds: (res.data.diamonds * 100) });
        }
        if (stock === 'daily-stocks') {
          setStockCost({ balance: res.data.balance, diamonds: res.data.diamonds });
        }
      }
    }
    fetchStockCost();
  }, [sessionStatus, router, id, stock, session]);

  useEffect(() => {
    const fetchBalance = async (userID: string) => {
      const res: { success: boolean; data?: { balance: number, diamonds: number }; message?: string } = await GetBalance(userID);
      if (res.success && res.data) {
        setUserBalance(res.data);
      }
      setBalanceLoading(false);
    }
    if (user) {
      fetchBalance(user.user.id);
    }
  }, [user, sessionStatus, router, id, stock, session]);

  useEffect(() => {
    if (userBalance.balance >= stockCost.balance || userBalance.diamonds >= stockCost.diamonds) {
      if (userBalance.balance === 0) {
        setRemaining({
          balance: userBalance.balance,
          diamonds: (userBalance.diamonds - stockCost.diamonds)
        });
        setUseDiamond(true);
        setQuantity(1);
      } else {
        setRemaining({
          balance: (userBalance.balance - stockCost.balance),
          diamonds: userBalance.diamonds
        });
        setUseDiamond(false);
        setQuantity(1);
      }
    } else {
      setQuantity(0);
    }
  }, [userBalance, stockCost]);

  useEffect(() => {
    userBalance.balance === 0 && userBalance.diamonds >= stockCost.diamonds && setUseDiamond(true);
    if (useDiamond) {
      if (userBalance.diamonds >= (stockCost.diamonds * quantity)) {
        setRemaining({
          balance: userBalance.balance,
          diamonds: userBalance.diamonds - (stockCost.diamonds * quantity)
        });
      } else {
        setQuantity(0);
      }
    } else {
      if (userBalance.balance >= (stockCost.balance * quantity)) {
        setRemaining({
          balance: userBalance.balance - (stockCost.balance * quantity),
          diamonds: userBalance.diamonds
        });
      } else {
        setQuantity(0);
      }
    }
  }, [useDiamond, quantity, userBalance, stockCost])

  const increment = () => {
    if (loading) {
      return;
    }
    if (useDiamond) {
      if (userBalance.diamonds >= (stockCost.diamonds * (quantity + 1))) {
        setQuantity(quantity + 1);
      }
    } else {
      if (userBalance.balance >= (stockCost.balance * (quantity + 1))) {
        setQuantity(quantity + 1);
      }
    }
  }

  const decrement = () => {
    if (loading) {
      return;
    }
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  }

  const handleQuantity = (value: string) => {
    if (value !== '') {
      const parsedValue = parseInt(value);
      if (parsedValue >= 1 && parsedValue * (useDiamond ? stockCost.diamonds : stockCost.balance) <= userBalance[useDiamond ? 'diamonds' : 'balance']) {
        setQuantity(parsedValue);
      }
    }
  }

  const handleUseDiamonds = () => {
    if (loading) {
      return;
    }
    useDiamond ? (userBalance.balance === 0) ? setQuantity(0) : setQuantity(1)
      : (userBalance.diamonds === 0) ? setQuantity(0) : setQuantity(1)
    setUseDiamond(!useDiamond);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (loading) {
      return;
    }
    setLoading(true);
    if (user && (userBalance.balance >= stockCost.balance || userBalance.diamonds >= stockCost.diamonds) && quantity >= 1) {
      const res: { success: boolean, message: string } = await BuyStock(user.user.id, stock as string, quantity, useDiamond ? (userBalance.diamonds - remaining.diamonds) : (userBalance.balance - remaining.balance), useDiamond);
      if (res.success) {
        sessionStorage.removeItem('user');
        router.replace("/dashboard");
      } else {
        setError(res.message);
      }
    }
    setLoading(false);
  }

  if (stockCost.balance === 0 || stockCost.balance === 0 || sessionStatus === 'loading') {
    return <Loading />;
  }

  return (
    sessionStatus === "authenticated" && (
      <div className="h-screen md:h-full overflow-y-scroll md:overflow-y-hidden overflow-x-hidden custom-scroll flex flex-col items-center justify-start md:justify-center md:mt-0 md:p-24">
        <div className={`${loading ? 'loading cursor-not-allowed' : ''} p-8 md:rounded-[4rem] md:shadow-lg md:border-2 md:border-[rgba(40,50,68)] w-full md:w-96`}>
          <div className={loading ? 'opacity-40' : ''}>
            <div className="ml-2 mt-2 md:mt-0">
              <Link href='/market' className="w-10 block">
                <Image src="/svg/goback.svg" alt="goback" width={49} height={49} />
              </Link>
            </div>
            <h1 className="mt-6 text-center text-[34px] font-bold buy-stock">Buy Stocks</h1>
            <div className="flex justify-between items-start mt-4">
              <div className="text-[#fff] mt-6">
                <h1 className="text-[16px] font-bold">{stock === 'daily-stocks' ? 'Daily Stock' : 'Long Term Stock'}</h1>
                {stock === 'daily-stocks' ?
                  <>
                    <div className="flex justify-start items-start ml-2 mt-2">
                      <Image src="/svg/dot.svg" alt="bullet" className="mt-[6px]" width={6} height={6} />
                      <p className="text-[12px] font-normal ml-2">24 hours stocking</p>
                    </div>
                    <div className="flex justify-start items-start ml-2 mt-2">
                      <Image src="/svg/dot.svg" alt="bullet" className="mt-[6px]" width={6} height={6} />
                      <p className="text-[12px] font-normal ml-2">The higher your rank, the Greater your return</p>
                    </div>
                  </>
                  :
                  <>
                    <div className="flex justify-start items-start ml-2 mt-2">
                      <Image src="/svg/dot.svg" alt="bullet" className="mt-[6px]" width={6} height={6} />
                      <p className="text-[12px] font-normal ml-2">35 days stocking</p>
                    </div>
                    <div className="flex justify-start items-start ml-2 mt-2">
                      <Image src="/svg/dot.svg" alt="bullet" className="mt-[6px]" width={6} height={6} />
                      <p className="text-[12px] font-normal ml-2">110% profit return</p>
                    </div>
                  </>
                }
              </div>
              <Image src="/svg/plant.svg" alt="plant" width={121} height={131} />
            </div>
            <div className="mt-6 md:mt-4">
              <h2 className="text-[#fff] text-[16px] font-normal">You have Remaining</h2>
              <div className="flex justify-around items-center mt-4">
                <div className="text-[#fff] w-[117px] h-[49px] flex justify-center items-center rounded-[2px] balance-usdt">
                  <div className={`flex justify-center ${balanceLoading ? 'items-center' : 'items-baseline'}`}>
                    {balanceLoading ? <div className="loading-team rounded-2xl py-3 px-6"></div> :
                      <p className="text-[16px] font-bold">{remaining.balance.toFixed(2)}</p>}
                    <span className="text-[11px] font-normal ml-1">USDT</span>
                  </div>
                </div>
                <div className="text-[#fff] w-[117px] h-[49px] flex justify-center items-center rounded-[2px] balance-diamond">
                  <div className="flex justify-center items-center">
                    {balanceLoading ? <div className="loading-team rounded-2xl py-3 px-6"></div> :
                      <p className="text-[16px] font-bold">{remaining.diamonds}</p>}
                    <Image loading="lazy" className="ml-2 w-[20px] h-[16px]" src="/img/diamond.png" alt="diamond" width={1833} height={1474} />
                  </div>
                </div>
              </div>
            </div>
            <div className="my-6 -ml-8 md:ml-0 w-screen md:w-full h-[1px] bg-[rgba(255,255,255,0.33)]" />
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col justify-center items-center">
                <div className="w-[310px] h-[166px] rounded-[5px] bg-[rgba(0,0,0,0.18)]">
                  <div className="text-[#fff] pt-6 pl-4 flex justify-start items-center">
                    <h2 className="text-[16px] font-semibold">Price:</h2>
                    <div className="flex justify-center items-baseline ml-4">
                      <h2 className="text-[16px] font-bold">{stockCost.balance}</h2>
                      <span className="text-[8px] font-normal">USDT</span>
                    </div>
                    <span className="text-[12px] font-normal mx-1">/</span>
                    <h2 className="text-[16px] font-bold">{stockCost.diamonds}</h2>
                    <Image loading="lazy" className="ml-[2px] mt-1 w-[14px] h-[10px]" src="/img/diamond.png" alt="diamond" width={1833} height={1474} />
                    <span className="text-[11px] font-normal ml-2">per stock</span>
                  </div>
                  <div className="text-[#fff] pt-6 pl-4 flex justify-start items-center sticky">
                    <h2 className="text-[16px] font-semibold mr-4">Quantity:</h2>
                    <Image onClick={decrement} className={`${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`} src="/svg/minus.svg" alt="minus" width={15} height={18} />
                    <input className="mx-2 w-[67px] h-[25px] bg-[#fff] rounded-[6px] text-[#000] text-[14px] font-bold text-center focus:border-none focus:outline-none" type="number" min="1" value={quantity} onChange={e => handleQuantity(e.target.value)} />
                    <Image onClick={increment} className={`${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`} src="/svg/plus.svg" alt="minus" width={19} height={19} />
                  </div>
                  <div className="text-[#fff] pt-6 pl-4 flex justify-start items-center">
                    <div className={`w-[12px] h-[12px] rounded-full ${useDiamond ? 'bg-[#DA15EB]' : 'bg-[#fff]'}`} />
                    <h2 className={`text-[14px] font-normal underline ml-1 ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`} onClick={handleUseDiamonds}>Use Diamonds</h2>
                  </div>
                </div>
              </div>
              {error !== '' && <div className="flex justify-center items-center"><p className="max-w-fit mt-8 rounded-lg px-2 py-[2px] bg-red-400 text-red-800 font-bold">{error}</p></div>}
              <div className="mt-8 md:mt-6 mb-12 flex justify-center items-center">
                <button type="submit" disabled={loading || balanceLoading} className={`${loading || balanceLoading ? 'cursor-not-allowed' : 'cursor-pointer'} px-4 py-1 flex justify-center items-center rounded-[8px] buyBtn`}>
                  <Image src="/svg/buyLarge.svg" alt="buy" width={27.07} height={19.57} />
                  <p className="text-[#fff] text-[30px] font-bold font-myanmarKhyay mx-1"> BUY</p>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  );
};

export default Buy;
