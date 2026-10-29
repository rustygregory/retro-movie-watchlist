const TMDB = (path) => `https://image.tmdb.org/t/p/w154${path}`
const WIKI = (path) => `https://upload.wikimedia.org/wikipedia/en/${path}`

function byYearThenTitle(a, b) {
  if (a.year !== b.year) return a.year - b.year
  return a.title.localeCompare(b.title)
}

function withNumbers(movies, prefix) {
  return [...movies]
    .sort(byYearThenTitle)
    .map((movie, index) => ({
      ...movie,
      id: `${prefix}-${index + 1}`,
      number: index + 1,
    }))
}

const MOVIES_80S_RAW = [
  {
    title: 'The Karate Kid',
    year: 1984,
    rating: 'PG',
    poster: WIKI('a/a9/Karate_kid.jpg'),
  },
  {
    title: 'Crocodile Dundee',
    year: 1986,
    rating: 'PG-13',
    poster: WIKI('a/a6/Crocodile_Dundee_original_Australian_New_Zealand_poster.jpg'),
  },
  {
    title: 'Short Circuit',
    year: 1986,
    rating: 'PG',
    poster: WIKI('b/b8/Short_Circuit_%281986_film_poster%29.jpg'),
  },
  {
    title: '¡Three Amigos!',
    year: 1986,
    rating: 'PG',
    poster: WIKI('8/87/Three_amigos_ver2.jpg'),
  },
  {
    title: 'Top Gun',
    year: 1986,
    rating: 'PG',
    poster: WIKI('4/46/Top_Gun_Movie.jpg'),
  },
  {
    title: 'Empire of the Sun',
    year: 1987,
    rating: 'PG',
    poster: WIKI('5/59/Empire_of_the_Sun.jpg'),
  },
  {
    title: 'The Princess Bride',
    year: 1987,
    rating: 'PG',
    poster: WIKI('d/db/Princess_bride.jpg'),
  },
  {
    title: 'Three Men and a Baby',
    year: 1987,
    rating: 'PG',
    poster: WIKI('b/bd/Three_Men_and_a_Baby.png'),
  },
  {
    title: "Bill & Ted's Excellent Adventure",
    year: 1989,
    rating: 'PG',
    poster: WIKI('b/bc/Bill_%26_Ted.jpg'),
  },
  {
    title: 'Indiana Jones and the Last Crusade',
    year: 1989,
    rating: 'PG-13',
    poster: WIKI('8/8c/Indiana_Jones_and_the_Last_Crusade.png'),
  },
]

const MOVIES_90S_RAW = [
  {
    title: 'Hook',
    year: 1991,
    rating: 'PG',
    poster: WIKI('0/0e/Hook_poster_transparent.png'),
  },
  {
    title: 'Captain Ron',
    year: 1992,
    rating: 'PG-13',
    poster: WIKI('1/18/Captain_ron_poster.jpg'),
  },
  {
    title: 'Far and Away',
    year: 1992,
    rating: 'PG-13',
    poster: WIKI('a/a1/Far_and_away_ver1.jpg'),
  },
  {
    title: 'Dennis the Menace',
    year: 1993,
    rating: 'PG',
    poster: WIKI('b/b0/Dennis_the_menace.jpg'),
  },
  {
    title: 'Groundhog Day',
    year: 1993,
    rating: 'PG',
    poster: WIKI('b/b1/Groundhog_Day_%28movie_poster%29.jpg'),
  },
  {
    title: 'Jurassic Park',
    year: 1993,
    rating: 'PG-13',
    poster: WIKI('e/e7/Jurassic_Park_poster.jpg'),
  },
  {
    title: 'Mrs. Doubtfire',
    year: 1993,
    rating: 'PG-13',
    poster: WIKI('5/5a/Mrs_Doubtfire.jpg'),
  },
  {
    title: 'Forrest Gump',
    year: 1994,
    rating: 'PG-13',
    poster: WIKI('6/67/Forrest_Gump_poster.jpg'),
  },
  {
    title: 'Titanic',
    year: 1997,
    rating: 'PG-13',
    poster: TMDB('/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg'),
  },
  {
    title: 'The Wedding Singer',
    year: 1998,
    rating: 'PG-13',
    poster: WIKI('8/84/The_Wedding_Singer_film_poster.jpg'),
  },
]

export const MOVIES_80S = withNumbers(MOVIES_80S_RAW, '80')
export const MOVIES_90S = withNumbers(MOVIES_90S_RAW, '90')

export const ALL_MOVIES = [...MOVIES_80S, ...MOVIES_90S]
export const MOVIE_IDS = ALL_MOVIES.map((m) => m.id)

export function getMovieById(id) {
  return ALL_MOVIES.find((m) => m.id === id)
}
