import React from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import InfiniteLoader from "react-window-infinite-loader";
import Measure, { ContentRect } from "react-measure";
import { VariableSizeList as List } from "react-window-reversed";

type InfiniteFeedProps = {
  loadMore: () => void;
  itemCount: number;
  reversed?: boolean;
  renderItem: ({
    ref,
    index,
  }: {
    ref: React.RefObject<HTMLDivElement>;
    index: number;
  }) => React.ReactNode;
};

const mergeRefs =
  (...refs: (React.Ref<HTMLDivElement> | undefined)[]) =>
  (incomingRef: HTMLDivElement | null) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(incomingRef);
      } else if (ref && "current" in ref) {
        (ref as any).current = incomingRef;
      }
    });
  };

const InfiniteFeed: React.FC<InfiniteFeedProps> = ({
  loadMore,
  itemCount,
  reversed = false,
  renderItem,
}) => {
  const itemSizes = React.useRef<Record<number, number>>({});
  const listRef = React.useRef<List|any>(null);
  const previousScrollTop = React.useRef<number>(0);

  const getItemSize = (index: number) => itemSizes.current[index] || 50;

  const handleItemResize = (index: number, { bounds, margin }: ContentRect) => {
    if (bounds) {
      itemSizes.current[index] =
        (bounds.height || 0) + (margin?.top || 0) + (margin?.bottom || 0);
      if (listRef.current) {
        listRef.current.resetAfterIndex(index, true);
      }
    }
  };

  const handleScroll = () => {
    if (listRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listRef.current?._outerRef;

      if (reversed) {

       // Check if scrolling up
       if (scrollTop < previousScrollTop.current) {
         // Trigger loadMore if near the top
         if (scrollTop < 100) {
           loadMore();
         }
       }

      } else {
        // Handle scroll direction when reversed is false (downward scrolling)
        if (scrollTop + clientHeight >= scrollHeight - 100) {
          // Trigger loadMore if near the bottom
          loadMore();
        }
      }

      // Update the previous scroll position
      previousScrollTop.current = scrollTop;
    }
  };

  return (
    <AutoSizer className="custom-scrollbar">
      {({ height, width }) => (
        <InfiniteLoader
          isItemLoaded={(index) => index < itemCount && index >= 0}
          itemCount={itemCount + 1}
          loadMoreItems={() => Promise.resolve()} // Handled manually by `handleScroll`
        >
          {({ onItemsRendered, ref }) => (
            <List
              ref={mergeRefs(ref, listRef) as any}
              onItemsRendered={onItemsRendered}
              itemCount={itemCount}
              itemSize={getItemSize}
              width={width}
              height={height}
              reversed={reversed as any}
              onScroll={handleScroll} // Attach custom scroll handler
            >
              {({ index, style }: { index: number; style: React.CSSProperties }) => (
                <div style={style}>
                  <Measure
                    bounds
                    margin
                    onResize={(resizeData) => handleItemResize(index, resizeData)}
                  >
                    {({ measureRef }) => renderItem({ ref: measureRef as any, index })}
                  </Measure>
                </div>
              )}
            </List>
          )}
        </InfiniteLoader>
      )}
    </AutoSizer>
  );
};

export default InfiniteFeed;
