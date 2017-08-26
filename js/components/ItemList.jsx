import React from 'react';
import ListItem from './ListItem';

function ItemList({ similarToItem, list, setSimilarItem }) {
  let items = list;

  if (similarToItem) {
    const similarItemSquareFootage = similarToItem.square_footage;
    // Arbitrary range for now
    items = items.filter(
      item =>
        item.square_footage > similarItemSquareFootage - 300 &&
        item.square_footage < similarItemSquareFootage + 300
    );
  }

  return (
    <div>
      {items.map(item => (
        <ListItem
          item={item}
          key={item.id}
          setSimilarItem={() => setSimilarItem(item)}
          setSimilarButtonText={
            "Only display results with square footage similar to this item's"
          }
        />
      ))}
    </div>
  );
}

export default ItemList;
