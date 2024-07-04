type NewsType = {
    title: string,
    description: string,
    img: string,
}

const newsData: NewsType[] = [
    {
        title: "Valero Energy",
        description: "Starting a new multination plant to meet the higher consumpion of energy...",
        img: "/img/2.jpg",
    },
    {
        title: "Gold advances multi-week highs above $1,920",
        description: "Gold extended its daily rally and climbed above $1,920 for the first time in over two weeks on Friday. Escalating geopolitical tensions....",
        img: "/img/3.jpg",
    },
    {
        title: "GSK tops Access to Medicine Index (ATMI) for eighth time",
        description: "Company also announces £100 million investment over next ten years to support health system strengthening...",
        img: "/img/4.jpg",
    },
    {
        title: "Tesla cuts prices",
        description: "Tesla cuts prices for many of its models worldwide, slashes cost of Full Self-Driving in U.S...",
        img: "/img/32.jpg",
    },
    {   
        title: "Ukraine debt deal",
        description: "Hedge fund pushes for power firm to be excluded from Ukraine debt deal. London-based VR Capital is part of bondholder group that does not want Ukrenergo debt to be part of sovereign restructuring...",
        img: "/img/33.jpg",
    },
    {
        title: "Dubai flooding",
        description: "The world is failing a big climate change drainage test. Vaper a startup that builds sewer drain and pipe-inspecting robots to find issues before major storms hit, has partnered with governments in Australia and the U.K....",
        img: "/img/34.jpg",
    },
    {
        title: "A landmark ruling",
        description: "A landmark ruling in Europe’s top rights court delivers a watershed moment for climate litigation...",
        img: "/img/31.jpg",
    },
];

type Props = {}

const News = (props: Props) => {
    return (
        <div className="px-0 md:px-10">
            <h1 className="text-[#fff] text-[28px] font-bold ml-4 md:ml-2">News</h1>
            <div className="bg-[#469BFF] h-[3px] w-full" />
            <div className="h-[560px] md:h-full my-6 overflow-y-scroll overflow-x-hidden news custom-scroll">
                {newsData.map((news: NewsType, i: number) => (
                    <div key={i} className={`${i === (newsData.length - 1) ? 'mb-72' : 'mb-4'} rounded-[10px] mx-2 bg-[rgba(7,7,7,0.16)] flex justify-start items-center`}>
                        <div style={{ background: `url(${news.img})` }} className="rounded-[10px] ml-2 my-1 w-[105px] h-[100px] news-img"></div>
                        <div className="ml-2 w-2/3 md:w-full p-2">
                            <h1 className="text-[#fff] text-[16px] font-bold">{news.title}</h1>
                            <p className="text-[#fff] text-[10px] md:text-[16px] font-normal">{news.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default News
