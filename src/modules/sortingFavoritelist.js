import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getAPI} from '../config/apiMethod';
import BASEURl from '../services/Api';
import {getUserDetailsSync} from '../utils/getUserDetailsSync';

export const sortingFavoritelist = createAsyncThunk(
  'sortingFavoritelist',
  async payload => {
    console.log('payload', payload);

    //
    const userDetails = await getUserDetailsSync();

    var myHeaders = new Headers();
    myHeaders.append('security_key', 'SurfLokal52');
    myHeaders.append('access_token', userDetails?.authToken);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    return payload.date_favorited
      ? await fetch(
          BASEURl +
            `webapi/v1/favorites/favoriteSorting.php?sort_by=${payload.sort_by}&date_favorited=${payload.date_favorited}`,
          requestOptions,
        )
          .then(response => response.json())
          .then(result => {
            console.log('favoriteSorting result', result);
            return result;
          })
          .catch(error => {
            console.log('favoriteSorting error', error);
            return error;
          })
      : payload.days_on_market
      ? await fetch(
          BASEURl +
            `webapi/v1/favorites/favoriteSorting.php?sort_by=${payload.sort_by}&days_on_market=${payload.days_on_market}`,
          requestOptions,
        )
          .then(response => response.json())
          .then(result => {
            console.log('favoriteSorting result', result);
            return result;
          })
          .catch(error => {
            console.log('favoriteSorting error', error);
            return error;
          })
      : payload.price_low_to_high
      ? await fetch(
          BASEURl +
            `webapi/v1/favorites/favoriteSorting.php?sort_by=${payload.sort_by}&price_low_to_high=${payload.price_low_to_high}`,

          requestOptions,
        )
          .then(response => response.json())
          .then(result => {
            console.log('favoriteSorting result', result);
            return result;
          })
          .catch(error => {
            console.log('favoriteSorting error', error);
            return error;
          })
      : payload.price_high_to_low
      ? await fetch(
          BASEURl +
            `webapi/v1/favorites/favoriteSorting.php?sort_by=${payload.sort_by}&price_high_to_low=${payload.price_high_to_low}`,

          requestOptions,
        )
          .then(response => response.json())
          .then(result => {
            console.log('favoriteSorting result', result);
            return result;
          })
          .catch(error => {
            console.log('favoriteSorting error', error);
            return error;
          })
      : payload.beds_high_to_low
      ? await fetch(
          BASEURl +
            `webapi/v1/favorites/favoriteSorting.php?sort_by=${payload.sort_by}&beds_high_to_low=${payload.beds_high_to_low}`,

          requestOptions,
        )
          .then(response => response.json())
          .then(result => {
            console.log('favoriteSorting result', result);
            return result;
          })
          .catch(error => {
            console.log('favoriteSorting error', error);
            return error;
          })
      : payload.baths_high_to_low
      ? await fetch(
          BASEURl +
            `webapi/v1/favorites/favoriteSorting.php?sort_by=${payload.sort_by}&baths_high_to_low=${payload.baths_high_to_low}`,

          requestOptions,
        )
          .then(response => response.json())
          .then(result => {
            console.log('favoriteSorting result', result);
            return result;
          })
          .catch(error => {
            console.log('favoriteSorting error', error);
            return error;
          })
      : payload.squraefeet_high_to_low
      ? await fetch(
          BASEURl +
            `webapi/v1/favorites/favoriteSorting.php?sort_by=${payload.sort_by}&squraefeet_high_to_low=${payload.squraefeet_high_to_low}`,

          requestOptions,
        )
          .then(response => response.json())
          .then(result => {
            console.log('favoriteSorting result', result);
            return result;
          })
          .catch(error => {
            console.log('favoriteSorting error', error);
            return error;
          })
      : '';
  },
);

//1
// await  getAPI(
//   BASEURl +
//     `webapi/v1/favorites/favoriteSorting.php?sort_by=${payload.sort_by}&date_favorited=${payload.date_favorited}`,
// )
//   .then(async response => {
//     const {data} = response;
//     return data;
//   })
//   .catch(e => {
//     return e;
//   })
//2
// await getAPI(
//   BASEURl +
//     `webapi/v1/favorites/favoriteSorting.php?sort_by=${payload.sort_by}&days_on_market=${payload.days_on_market}`,
// )
//   .then(async response => {
//     const {data} = response;
//     return data;
//   })
//   .catch(e => {
//     return e;
//   })

//
// await getAPI(
//   BASEURl +
//     `webapi/v1/favorites/favoriteSorting.php?sort_by=${payload.sort_by}&price_low_to_high=${payload.price_low_to_high}`,
// )
//   .then(async response => {
//     const {data} = response;
//     return data;
//   })
//   .catch(e => {
//     return e;
//   })
//
// await getAPI(
//   BASEURl +
//     `webapi/v1/favorites/favoriteSorting.php?sort_by=${payload.sort_by}&price_high_to_low=${payload.price_high_to_low}`,
// )
//   .then(async response => {
//     const {data} = response;
//     return data;
//   })
//   .catch(e => {
//     return e;
//   })
//
// await getAPI(
//   BASEURl +
//     `webapi/v1/favorites/favoriteSorting.php?sort_by=${payload.sort_by}&beds_high_to_low=${payload.beds_high_to_low}`,
// )
//   .then(async response => {
//     const {data} = response;
//     return data;
//   })
//   .catch(e => {
//     return e;
//   })
//
// await getAPI(
//   BASEURl +
//     `webapi/v1/favorites/favoriteSorting.php?sort_by=${payload.sort_by}&baths_high_to_low=${payload.baths_high_to_low}`,
// )
//   .then(async response => {
//     const {data} = response;
//     return data;
//   })
//   .catch(e => {
//     return e;
//   })
//
// await getAPI(
//   BASEURl +
//     `webapi/v1/favorites/favoriteSorting.php?sort_by=${payload.sort_by}&squraefeet_high_to_low=${payload.squraefeet_high_to_low}`,
// )
//   .then(async response => {
//     const {data} = response;
//     return data;
//   })
//   .catch(e => {
//     return e;
//   })

const sortingFavoritelistSlice = createSlice({
  name: 'sortingFavoritelist',
  initialState: {
    sortingFavoritelistData: [],
  },
  extraReducers: {
    [sortingFavoritelist.pending]: (state, action) => {
      state.satus;
    },
    [sortingFavoritelist.fulfilled]: (state, action) => {
      state.status = 'success';
      state.sortingFavoritelistData = action.payload;
    },
    [sortingFavoritelist.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default sortingFavoritelistSlice.reducer;
