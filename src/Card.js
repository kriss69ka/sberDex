import React from 'react';

import pokeball from './pokeball.png';

const Pokeball = () => <img src={pokeball} alt="pokeball" style={{ width: '96px', marginBottom: '10px' }} />;


export default class Card extends React.Component {
state = {
  opend: false,
}

handleClick = () => this.setState((state) => ({ opend: !state.opend }))

render() {
  const { pokemon } = this.props;
  const { opend } = this.state;
  return (
    opend
      ? pokemon && (
        <div className="card infoCard" onClick={this.handleClick}>
          <div>
        Name:
            {' '}
            <span className="name">{pokemon.name}</span>
          </div>
          <div>
        Abilities:
            {pokemon.abilities && pokemon.abilities.map((ability) => (
              <span className="abilities">
                {ability.ability.name}
              </span>
            )) || <div>No information</div>}
          </div>
          <div>
        Stats:
            {pokemon.stats && pokemon.stats.map((stats) => (
              <div className="stats-block">
                <div className="stats stats-name">
                  {stats.stat.name}
                </div>
                <div className="stats stats-value">
                  {stats.base_stat}
                </div>
              </div>
            )) || <div>No information</div>}
          </div>
        </div>
      ) : (
        <div
          className="card"
          onClick={this.handleClick}
        >
          {pokemon.avatar ? <img src={pokemon.avatar} alt={pokemon.name} style={{ width: '100%' }} /> : <Pokeball />}
          <div className="name">{pokemon.name}</div>
        </div>
      )
  );
}
}
