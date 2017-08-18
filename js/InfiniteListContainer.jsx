import React, { Component } from 'react';
import axios from 'axios';
import { sortBy } from 'lodash';
import InfiniteScroll from 'react-infinite-scroller';
import styled from 'styled-components';
import ListItem from './ListItem';
import SortingBar from './SortingBar';
import sortOptions from './sortOptions';

function sortItems(items, sortOption, reversed = false) {
  let sortedItems = sortBy(items, [item => item[sortOption.value]]);

  if (reversed) {
    sortedItems = sortedItems.reverse();
  }

  return sortedItems;
}

class InfiniteListContainer extends Component {
  constructor() {
    super();
    this.state = {
      list: [],
      remoteRowCount: 1,
      currentPage: 0,
      selectedSortOption: sortOptions[0],
      orderReversed: false,
      similarToItem: null
    };
  }

  loadMoreRows = () => {
    const { list, currentPage, selectedSortOption, orderReversed } = this.state;
    const nextPage = currentPage + 1;

    return axios
      .get(`https://thisopenspace.com/lhl-test?page=${nextPage}`)
      .then(response => {
        this.setState({
          list: [
            ...list,
            ...sortItems(response.data.data, selectedSortOption, orderReversed)
          ],
          currentPage: nextPage,
          remoteRowCount: response.data.total
        });
      })
      .catch(error => {
        console.error('axios error', error); // eslint-disable-line no-console
      });
  };

  renderList = () => {
    const { similarToItem } = this.state;
    let items = this.state.list;

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
            setSimilarItem={() => this.setState({ similarToItem: item })}
            setSimilarButtonText={
              "Only display results similar to this item' square footage"
            }
          />
        ))}
      </div>
    );
  };

  renderSimilarItemInfo = () => {
    const { similarToItem } = this.state;

    const Button = styled.button`
      margin-left: 10px;
    `;

    if (similarToItem) {
      return (
        <div>
          <br />
          {`Displaying results similar to ${similarToItem.name}`}
          <Button onClick={() => this.setState({ similarToItem: null })}>
            Display all
          </Button>
        </div>
      );
    }

    return null;
  };

  render() {
    const {
      loadMoreRows,
      renderList,
      state: {
        remoteRowCount,
        list,
        selectedSortOption: currentSortOption,
        orderReversed
      }
    } = this;

    return (
      <div>
        <SortingBar
          selectedSortOption={currentSortOption}
          selectSortOption={selectedSortOption => {
            this.setState({
              selectedSortOption,
              list: sortItems(list, selectedSortOption, orderReversed)
            });
          }}
          reverseOrder={() => {
            this.setState({
              orderReversed: !orderReversed,
              list: sortItems(list, currentSortOption, !orderReversed)
            });
          }}
        />

        {this.renderSimilarItemInfo()}

        <InfiniteScroll
          pageStart={1}
          loadMore={loadMoreRows}
          hasMore={remoteRowCount > list.length}
          loader={<div className="loader">Loading ...</div>}
        >
          {renderList()}
        </InfiniteScroll>
      </div>
    );
  }
}

export default InfiniteListContainer;
