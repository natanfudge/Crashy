import React from "react";
import {Column} from "../simple/Flex";

// This is no longer lazy, but is just a normal column. I have figured out it works better to optimize the contents of childProvider
// than trying to lazy load. If you encounter lags, try using bare-bones html components with css-in-js for style.
export function LazyColumn<T>({
                                  data,
                                  childProvider
                              }: { data: T[], childProvider: (item: T, index: number) => JSX.Element }) {
    // const batchSize = 30;
    // const [activeAmount, setActiveAmount] = React.useState(batchSize)
    // const hasMore = activeAmount < data.length;
    // const ref = useRef<HTMLDivElement>(null)
    // // const singleChildHeight = useHeight(ref)

    // const active = data.slice(0, activeAmount);

    return <Column>
        {data.map((item, index) =>
            childProvider(item, index)
        )}
    </Column>

    // const Row = ({index,style}) =>

    // return <FixedSizeList itemSize={35} height={35 * data.length} itemCount={data.length} width={"50%"}>
    //     {({index, style}) => (
    //         <div ref={index === 0 ? ref : undefined} style={style}>
    //             {childProvider(data[index], index)}
    //         </div>)}
    // </FixedSizeList>

    // return <div style={{minHeight: singleChildHeight * data.length}}>
    //     <InfiniteScroll  dataLength={activeAmount}
    //                     next={() => setActiveAmount(Math.min(activeAmount + batchSize, data.length))}
    //                     hasMore={hasMore}
    //                     loader={<h4>Loading...</h4>}
    //     >
    //         {({ index, style }) =>
    //             <div ref={index === 0 ? ref : undefined} style = {style}>
    //                 {childProvider(data[index], index)}
    //             </div>
    //
    //     </InfiniteScroll>
    // </div>
}

{/*            {/*{active.map((item, index) => <div >{childProvider(item, index)}</div>)}*/
}


