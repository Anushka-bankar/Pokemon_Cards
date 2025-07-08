import { useEffect, useState } from "react";
import "./index.css";
import { PokemonCards } from "./PokemonCards";
 
export const Pokemon = () => {

    const [pokemon, setPokemon] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const API = "https://pokeapi.co/api/v2/pokemon?limit=124";

    // Function to fetch Pokemon data from the API
    const fetchPokemon = async() => {
        try {
            // Fetching the data from the API
            const res = await fetch(API);
            //converting response in json format
            const data = await res.json();
            // console.log(data);

             // Mapping through each Pokémon in the results array
            const detailedPokemonData = data.results.map(async (curPokemon) => {  //to use await we have to write async
                const res = await fetch(curPokemon.url);
                const data = await res.json();
                console.log(data);
                return data;
            });
            // console.log(detailedPokemonData);

            const detailedResponses = await Promise.all(detailedPokemonData);
            console.log(detailedResponses);

            setPokemon(detailedResponses);
            setLoading(false);
        }catch(error) {
            console.log(error);
            setError(error);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchPokemon();
    },[]);

    const searchData = pokemon.filter((curPokemon) =>
    curPokemon.name.toLowerCase().includes(search.toLowerCase())
    );

    if(loading) {
        return (
            <div>
                <h1>Loading..</h1>
            </div>
        );
    }

    if(error) {
        return (
            <div>
                <h1>{error.message}</h1>
            </div>
        );
    }

    return (
        <>
        <section className="container">
            <header>
                <h1>Let's Catch Pokemon</h1>;
            </header>
            <div className="pokemon-search">
                <input
                    type="text"
                    placeholder="search Pokemon"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div>
                <ul className="cards">
                    {searchData.map((curPokemon) => {
                            return (
                            <PokemonCards key ={curPokemon.id} pokemonData = {curPokemon}/>
                            );
                        })}
                </ul>
            </div>
        </section>
        </>
    );
};