import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import {Column} from "../simple/Flex";

// This is no longer lazy, but is just a normal column. I have figured out it works better to optimize the contents of childProvider
// than trying to lazy load. If you encounter lags, try using bare-bones html components with css-in-js for style.
export function LazyColumn<T>({
                                  data,
                                  childProvider,
    batchSize,
    className
                              }: { data: T[], childProvider: (item: T, index: number) => JSX.Element, batchSize? : number, className?: string }) {
    const usedBatchSize = batchSize ?? 50;
    const [activeAmount, setActiveAmount] = React.useState(usedBatchSize)
    const hasMore = activeAmount < data.length;

    const active = data.slice(0, activeAmount);

    return <InfiniteScroll className={className} dataLength={activeAmount}
                        next={() => setActiveAmount(Math.min(activeAmount + usedBatchSize, data.length))}
                        hasMore={hasMore}
                        loader={<h4>Loading...</h4>}
        >
            {active.map((item, index) => childProvider(item, index))}
        </InfiniteScroll>

}



