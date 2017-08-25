import React, { Component } from 'react';
import axios from 'axios';
import { sortBy } from 'lodash';
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
    const nextPage = this.state.currentPage + 1;

    return axios
      .get(`https://thisopenspace.com/lhl-test?page=${nextPage}`)
      .then(response => {
        const { list, selectedSortOption, orderReversed } = this.state;

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

  renderSimilarItemInfo = () => {
    const { similarToItem } = this.state;

    if (similarToItem) {
      return (
        <SimilarItemInfo
          similarToItem={similarToItem}
          resetSimilarItem={() => this.setState({ similarToItem: null })}
        />
      )
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
