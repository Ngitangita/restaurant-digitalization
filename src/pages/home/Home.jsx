
// import StockOperation from "../Stocks/Operation";

import CategoriesList from "../../components/categories/Categories";

export default function Home() {

  return (
    <div className="max-w-[970px]">
      <div className="w-full max-w-[930px] h-full flex flex-row flex-wrap gap-7
        max-h-[calc(100%-80px)] fixed
        overflow-y-scroll overflow-x-hidden scrollbar-custom text-gray-500">
        {/* <StockOperation /> */}
        <CategoriesList />
      </div>
    </div>
  );
}
