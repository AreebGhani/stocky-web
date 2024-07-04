import Image from "@/utils/Image";
import { DailyStock } from "@/types/types";
import Link from "next/link";

const dailyStocks: DailyStock[] = [
  {
    id: 1,
    title: "FICO",
    description: "A leading software company in world",
    percentage: +1.8,
    img: "/img/8.jpg",
    width: 900,
    height: 900,
  },
  {
    id: 2,
    title: "Jinko",
    description: "The company is Largest Solar panel and Cells Manufacturer",
    percentage: +7.8,
    img: "/img/9.jpg",
    width: 200,
    height: 170,
  },
  {
    id: 3,
    title: "NVIDIA",
    description: "The company is global semiconductor graphics CPU manufacturer",
    percentage: +3.6,
    img: "/img/10.jpg",
    width: 900,
    height: 900,
  },
  {
    id: 4,
    title: "DEVON Energy",
    description: "A leading independent oil and gas explorer ",
    percentage: +1.8,
    img: "/img/11.png",
    width: 433,
    height: 377,
  },
  {
    id: 5,
    title: "Renesas Electronics Corporation",
    description: "A global leader in microcontrollers, analog, power and SoC products",
    percentage: +1.8,
    img: "/img/12.jpg",
    width: 1280,
    height: 900,
  },
  {
    id: 6,
    title: "Dell Technologies",
    description: "A technology company that develops, sells and repairs computers and related products",
    percentage: +2.3,
    img: "/img/13.jpg",
    width: 1600,
    height: 900,
  },
  {
    id: 7,
    title: "Atkore",
    description: "Atkore manufactures electrical conduit and fittings, cable and cable management systems, infrastructure, safety and security products.",
    percentage: +3.6,
    img: "/img/14.png",
    width: 301,
    height: 167,
  },
  {
    id: 8,
    title: "Steel Dynamics",
    description: "the largest domestic steel producers and metal recyclers in the United States, with one of the most diversified product ",
    percentage: +1.8,
    img: "/img/15.png",
    width: 300,
    height: 168,
  },

  {
    id:9 ,
    title: "Nucor ",
    description: "Nucor Corporation is the safest, highest quality, lowest cost, most productive and most profitable steel products company in the world. ",
    percentage: +1.8,
    img: "/img/17.png",
    width: 1238,
    height: 450 ,
  },

  {
    id: 10,
    title: "Vornado",
    description: "Vornado Realty Trust is a real estate investment trust formed in Maryland ",
    percentage: +1.2,
    img: "/img/18.jpg",
    width: 1280 ,
    height: 720 ,
  },

  {
    id: 11,
    title: "Axcelis Technologies ",
    description: "An American company engaging in the design, manufacture, and servicing of capital equipment for the semiconductor ",
    percentage: +2.1,
    img: "/img/19.jpg",
    width: 1280 ,
    height: 720 ,
  },

  {
    id: 12,
    title: "Tricon Residential ",
    description: "Tricon Residential is a Canadian real estate company. The company invests in rental homes ",
    percentage: +1.2,
    img: "/img/20.jpg",
    width: 1640,
    height: 856,
  },

  {
    id: 13,
    title: "Eli Lilly ",
    description: "one of the world's most-respected pharmaceutical companies,Lilly became an active civil leader and philanthropist ",
    percentage: +1.2,
    img: "/img/21.png",
    width: 225,
    height: 225,
  },

  {
    id: 14,
    title: "Wayfair Inc.",
    description: "Wayfair is a legitimate company with safe practices surrounding shopping, shipping and consumer privacy",
    percentage: +1.4,
    img: "/img/25.jpg",
    width: 1200,
    height: 630,
  },

];

type Props = {}

const DailyStocks = (props: Props) => {
  return (
    <div className="md:pt-10">
      <div className="px-0 md:px-10">
        <h1 className="text-[#fff] text-[24px] font-bold ml-4 md:ml-2">Daily Stocks</h1>
        <div className="bg-[#469BFF] h-[3px] w-full" />
        <div className="h-full my-6 overflow-x-hidden news">
          {dailyStocks.map((stock: DailyStock, i: number) => (
            <div key={i} className={`${i === (dailyStocks.length - 1) ? 'mb-96' : 'mb-4'} rounded-[10px] bg-[rgba(7,7,7,0.16)] flex justify-start items-center stockDaily-shadow`}>
              <div style={{ background: `url(${stock.img})` }} className="rounded-[10px] ml-2 my-1 w-[105px] h-[100px] news-img"></div>
              <div className="flex justify-between items-center ml-2 w-2/3 md:w-full p-2">
                <div className="w-1/2 lg:w-5/6">
                  <h1 className="text-[#fff] text-[16px] font-bold">{stock.title}</h1>
                  <p className="text-[#fff] text-[10px] md:text-[16px] font-normal">{stock.description}</p>
                </div>
                {/* <p className={`text-[12px] mx-4 font-normal ${stock.percentage < 0 ? 'text-[rgba(239,68,68,0.80)]' : 'text-[rgba(21,235,81,0.80)]'}`}>{stock.percentage < 0 ? stock.percentage : '+' + stock.percentage}%</p> */}
                <div className="mr-0 md:mr-4">
                  <Link href={`/market/buy/daily-stocks/${stock.id}`} className="cursor-pointer px-2 py-1 flex justify-center items-center rounded-[8px] bg-[#0ACC40] hover:bg-[#09A536] buyBtn-shadow">
                    <Image src="/svg/buy.svg" alt="buy" width={10} height={10} />
                    <p className="text-[#fff] text-[16px] font-normal font-myanmarKhyay mx-1"> BUY</p>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DailyStocks
