import React, { Component } from 'react';
import axios from 'axios';
import { sortBy, chunk, flatten } from 'lodash';
import InfiniteScroll from 'react-infinite-scroller';
import styled from 'styled-components';
import ItemList from '../components/ItemList';
import SimilarItemInfo from '../components/SimilarItemInfo';
import SortingBar from '../components/SortingBar';
import sortOptions from '../constants/sortOptions';
import './InfiniteListContainer.css';

const Loader = styled.h3`
  margin-top: 10px;
`;

const batchSize = 10;

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
      pageLoaded: 0,
      selectedSortOption: sortOptions[0],
      orderReversed: false,
      similarToItem: null
    };

    this.loadedItems = [];
  }

  loadMoreRows = () => {
    const { currentPage, pageLoaded } = this.state;
    const nextPage = currentPage + 1;

    if (nextPage > pageLoaded) {
      return axios
        .get(`https://thisopenspace.com/lhl-test?page=${nextPage}`)
        .then(response => {
          const { list, selectedSortOption, orderReversed } = this.state;
          this.loadedItems = this.loadedItems.concat(response.data.data);
          this.setState({
            list: [
              ...list,
              ...sortItems(
                response.data.data,
                selectedSortOption,
                orderReversed
              )
            ],
            pageLoaded: this.state.pageLoaded + 1,
            currentPage: nextPage,
            remoteRowCount: response.data.total
          });
        });
    } else {
      const rowChunks = chunk(this.loadedItems, batchSize);
      this.setState({
        list: flatten(rowChunks.slice(0, nextPage)),
        currentPage: nextPage
      });
    }
  };

  renderSimilarItemInfo = () => {
    const { similarToItem } = this.state;

    if (similarToItem) {
      return (
        <SimilarItemInfo
          similarToItem={similarToItem}
          resetSimilarItem={() => this.setState({ similarToItem: null })}
        />
      );
    }

    return null;
  };

  render() {
    const {
      loadMoreRows,
      renderList,
      renderLoader,
      renderSimilarItemInfo,
      state: {
        remoteRowCount,
        list,
        selectedSortOption: currentSortOption,
        orderReversed,
        similarToItem
      }
    } = this;

    return (
      <div>
        <SortingBar
          selectedSortOption={currentSortOption}
          selectSortOption={selectedSortOption => {
            this.loadedItems = sortItems(
              this.loadedItems,
              selectedSortOption,
              orderReversed
            );

            this.setState({
              selectedSortOption,
              currentPage: 1,
              list: this.loadedItems.slice(0, 10)
            });
          }}
          reverseOrder={() => {
            this.loadedItems = sortItems(
              this.loadedItems,
              currentSortOption,
              !orderReversed
            );

            this.setState({
              orderReversed: !orderReversed,
              currentPage: 1,
              list: this.loadedItems.slice(0, 10)
            });
          }}
        />

        {renderSimilarItemInfo()}

        <InfiniteScroll
          pageStart={1}
          loadMore={loadMoreRows}
          hasMore={remoteRowCount > list.length}
          loader={<Loader>Loading ...</Loader>}
        >
          <ItemList
            similarToItem={similarToItem}
            list={list}
            setSimilarItem={item => this.setState({ similarToItem: item })}
          />
        </InfiniteScroll>
      </div>
    );
  }
}

export default InfiniteListContainer;
