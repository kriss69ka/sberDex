import React from 'react';
import ReactPaginate from 'react-paginate';

import Card from './Card';
import Loader from './loader';

export default class PokemonsPage extends React.Component {
  // ToDo: переработать хранение и загрузку данных
  // ToDo: добавить поиск

  state = {
    loading: true,
    pokemonsList: {},
    nameList: [],
    currentPage: 1,
    maxPages: 34,
  };

  componentDidMount() {
    this.pokeListFecher()
      .then(this.pokeInfoFetcher);
  }

  componentDidUpdate(prevProps, prevState) {
    const { currentPage, pokemonsList } = this.state;
    if (currentPage !== prevState.currentPage && !pokemonsList[currentPage]) {
      this.setState({ loading: true });
      this.pokeListFecher(currentPage * 28)
        .then(this.pokeInfoFetcher);
    }
  }

  pokeListFecher = (offset = 0, limit = 28) => fetch(`https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offset}`)
    .then((response) => response.json())
    .then((response) => {
      response.results.map((pokemon) => this.setState((state) => ({
        pokemonsList: {
          ...state.pokemonsList,
          [state.currentPage]: {
            ...state.pokemonsList[state.currentPage],
            [pokemon.name]: pokemon,
          },
        },
        nameList: {
          ...state.nameList,
          [state.currentPage]: [...(state.nameList[state.currentPage] || []), pokemon.name],
        },
      })));
      return response.results;
    })

  pokeInfoFetcher = (pokemons) => pokemons.map((pokemon) => fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`)
    .then((response) => response.json())
    .then((response) => {
      const img = new Image();
      img.src = response.sprites.front_default;
      img.onload = () => {
        this.setState((state) => ({
          pokemonsList: {
            ...state.pokemonsList,
            [state.currentPage]: {
              ...state.pokemonsList[state.currentPage],
              [response.name]: {
                ...state.pokemonsList[state.currentPage][response.name],
                id: response.id,
                avatar: response.sprites.front_default,
                types: response.types,
                stats: response.stats,
                abilities: response.abilities,
              },
            },
          },
          loading: false,
        }));
      };
      this.setState({ loading: false });
    }))

    handlePageClick = (e) => this.setState({ currentPage: e.selected + 1 })

    render() {
      const {
        pokemonsList, nameList, maxPages, currentPage, loading,
      } = this.state;
      return (
        <>
          {loading && (
          <div className="loading">
            <Loader />
          </div>
          )}
          <div
            className="pokemonsList"
          >
            {nameList[currentPage] && nameList[currentPage].map((id) => {
              const pokemon = pokemonsList[currentPage][id];
              return (
                <Card key={pokemon.name} pokemon={pokemon} />
              );
            })}
          </div>
          <div className="react-paginate">
            <ReactPaginate
              className="react-paginate"
              pageCount={maxPages}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={this.handlePageClick}
            />
          </div>
        </>
      );
    }
}
