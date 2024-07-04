import Image from "@/utils/Image";
import { LongTermStock } from "@/types/types";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, A11y, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import Link from "next/link";

const longTermStocks: LongTermStock[] = [
  { id: 1, img: "/img/5.jpg", width: 752, height: 480 },
  { id: 2, img: "/img/6.png", width: 311, height: 219 },
  { id: 3, img: "/img/7.jpg", width: 1280, height: 1280 },
  { id: 4, img: "/img/22.jpg", width: 1025, height: 537 },
  { id: 5, img: "/img/23.png", width: 340, height: 189 },
  { id: 6, img: "/img/26.jpg", width: 500, height: 500 },
  { id: 7, img: "/img/27.png", width: 500, height: 500 },
  { id: 8, img: "/img/28.jpg", width: 400, height: 400 },

];

type Props = {}

const LongTermStocks = (props: Props) => {
  return (
    <div className="pt-5 md:pt-10">
      <div className="px-0 md:px-10">
        <h1 className="text-[#fff] text-[24px] font-bold ml-4 md:ml-2">Long Term Stocks</h1>
        <div className="bg-[#469BFF] h-[3px] w-full" />
        <div className="mx-2 overflow-hidden">
          <Swiper
            className="mt-5 mb-10 md:my-10"
            centeredSlides={false}
            modules={[Pagination, A11y, Autoplay]}
            spaceBetween={10}
            slidesPerView={3}
            pagination={{ type: 'bullets', bulletClass: 'swiper-custom-pagination-bullet', bulletActiveClass: 'swiper-custom-pagination-bullet-active', clickable: true }}
            autoplay={{ delay: 5000, pauseOnMouseEnter: true, disableOnInteraction: true }}
            onSwiper={(swiper) => { }}
            onSlideChange={() => { }}
            breakpoints={{
              676: {
                slidesPerView: 5,
              },
              1024: {
                slidesPerView: 8,
              },
            }}
          >
            {longTermStocks.map((stock: LongTermStock, i: number) => (
              <SwiperSlide key={Math.random()} className="relative mb-4 md:mb-6">
                <Image className="img-shadow rounded-[10px] md:rounded-[20px] w-[100px] md:w-[100px] h-[100px] md:h-[100px]" src={stock.img} alt="slider" width={stock.width} height={stock.width} />
                <div className="absolute top-[73%] left-[17%]">
                  <div className="cursor-pointer px-1 flex justify-center items-center rounded-[15px] bg-[#0ACC40] hover:bg-[#09A536] buyBtn-shadow">
                    <Image src="/svg/buy.svg" alt="buy" width={10} height={10} />
                    <Link href={`/market/buy/long-term-stocks/${stock.id}`} className="text-[#fff] text-[15px] font-normal font-myanmarKhyay mx-1"> BUY</Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  )
}

export default LongTermStocks
