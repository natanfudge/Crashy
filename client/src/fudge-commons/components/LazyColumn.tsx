//TODO: maybe improve this to calculate height AOT (would require reimplementing InfiniteScroll I think)
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";

export function LazyColumn<T>({data, childProvider}: { data: T[], childProvider: (item: T, index: number) => JSX.Element }) {
    const batchSize = 25;
    const [activeAmount, setActiveAmount] = React.useState(batchSize)
    const hasMore = activeAmount < data.length;

    const active = data.slice(0, activeAmount);

    return <InfiniteScroll dataLength={activeAmount}
                           next={() => setActiveAmount(Math.min(activeAmount + batchSize, data.length))}
                           hasMore={hasMore}
                           loader={<h4>Loading...</h4>}
    >
        {active.map((item, index) => childProvider(item, index))}
    </InfiniteScroll>
}