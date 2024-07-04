import packageJSON from "@/package.json";

type Props = {}

const Version = (props: Props) => <p className="absolute bottom-28 lg:bottom-32 text-[rgba(255,255,255,0.67)] text-[12px] font-medium text-center">Version: {packageJSON.version}</p>;

export default Version
