import Image from "@/utils/Image";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, A11y, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

type Props = {}

const Slider = (props: Props) => {
    return (
        <Swiper
            className="my-10"
            centeredSlides={true}
            modules={[Pagination, A11y, Autoplay]}
            spaceBetween={10}
            slidesPerView={1}
            pagination={{ type: 'bullets', bulletClass: 'swiper-custom-pagination-bullet', bulletActiveClass: 'swiper-custom-pagination-bullet-active', clickable: true }}
            autoplay={{ delay: 5000, pauseOnMouseEnter: true, disableOnInteraction: true }}
            onSwiper={(swiper) => { }}
            onSlideChange={() => { }}
        >
            <SwiperSlide>
                <div className="flex items-center justify-center rounded-[5px]">
                    <Image className="rounded-[5px] md:rounded-[15px] w-[362px] md:w-[1156px] h-[176px] md:h-[504px]" src="/img/1.jpg" alt="slider" width={1056} height={704} />
                </div>
            </SwiperSlide>
            <SwiperSlide>
                <div className="flex items-center justify-center rounded-[5px]">
                    <Image className="rounded-[5px] md:rounded-[15px] w-[362px] md:w-[1156px] h-[176px] md:h-[504px]" src="/img/29.jpg" alt="slider" width={1056} height={704} />
                </div>
            </SwiperSlide>
            <SwiperSlide>
                <div className="flex items-center justify-center rounded-[5px]">
                    <Image className="rounded-[5px] md:rounded-[15px] w-[362px] md:w-[1156px] h-[176px] md:h-[504px]" src="/img/30.jpg" alt="slider" width={1056} height={704} />
                </div>
            </SwiperSlide>
        </Swiper>
    )
}

export default Slider
