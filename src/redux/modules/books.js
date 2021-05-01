import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import moment from 'moment';
import { getCookie } from '../../shared/Cookie';

axios.defaults.baseURL = 'http://lkj99.shop';
axios.defaults.headers.common["Authorization"]= `Bearer ${getCookie('is_login')}`;


const booksSlice = createSlice({
  name: "books",
  initialState: {
    books: [],
    date: moment(),
    formated_date: 0,
    component:'',
    // selected_card:0,
    book_detail:[],
    page: 1,
    next:true,
    custom_question:[],
    page_owner:null,
    // card_answers:null,
  },
  reducers: {
    // setOther:(state, action) => {
    //     state.other = action.payload;
    // },
    // setCardAnswers:(state, action) => {
    //     state.card_answers = action.payload;
    // },
    setPageOwner: (state, action) => {
        state.page_owner = action.payload;
    },

    setBookDetail: (state,action) => {
        state.book_detail = action.payload;
    },

    setBooks:(state, action) => {
        state.books = action.payload
    },

    changeDate: (state, action) => {
        console.log(action.payload)
        if(action.payload === 2){
            const new_date = state.date.add(1,'M');
            state.date = new_date
            state.formated_date = new_date.format('YYYY . MM')
        } else if(action.payload === 1){
            const new_date = state.date.subtract(1,'M')
            state.date = new_date
            state.formated_date = new_date.format('YYYY . MM')
        }
        else if(action.payload === 0){
            state.formated_date = state.date.format('YYYY . MM')
        } else {
            const new_date = moment(action.payload, 'YYYYMMDD');
            // console.log(new_date)
            state.date = new_date;
            state.formated_date = new_date.format('YYYY . MM');
        }
    },
    setComponent: (state, action) => {
        state.component = action.payload;
    },
    setPage: (state, action) => {
        state.page = action.payload;
    },
    setNext: (state, action) => {
        state.next = action.payload;
    },
    setCustomQuestion: (state, action) => {
        action.payload.forEach(v => {
            state.custom_question.push(v);
        })
    },
    resetCustiomQuestion: (state) => {
        state.custom_question = [];
    }
    // setSelect : (state, action) => {
    //     state.selected_card = action.payload
    // }
  },
});


const getBooks = (towhen) => {
    return function( dispatch, getState ) {

        if(towhen === 1){
            dispatch(changeDate(1));
        }
        if(towhen === 2) {
            dispatch(changeDate(2));
        }

        const date = getState().books.date.format('YYMM')
        // console.log(date)
        const options = {
            url:`/bookshelf/books/${date}`,
            method:'GET',
        };
        axios(options).then((response) => {
            // console.log(response.data)
            dispatch(setBooks(response.data.books))
        }).catch((err) => {
            console.log(err)
            if(err.response){
                console.log(err.response.data)
            }
        })
    }
}



const getBookDetail = (date) => {
    return function(dispatch) { 
        const options = {
            url:`bookshelf/bookDetail/${date}`,
            method:'GET',
        };
        axios(options).then((response) => {
            dispatch(setBookDetail(response.data.booksDiary))
        }).catch((err) => {
            console.log(err);
            if(err.response){
                console.log(err.response.data)
            }
        })
    }

}

const getOthersBooks = (towhen, id) => {
    return function( dispatch, getState ) {

        if(towhen === 1){
            dispatch(changeDate(1));
        }
        if(towhen === 2) {
            dispatch(changeDate(2));
        }

        const date = getState().books.date.format('YYMM')
        // console.log(date)
        const options = {
            url:`/bookshelf/other/books/${date}/${id}`,
            method:'GET',
        };
        axios(options).then((response) => {
            console.log(response.data)
            dispatch(setBooks(response.data.books))
        }).catch((err) => {
            console.log(err)
            if(err.response){
                console.log(err.response.data)
            }
        })
    }
}

const getOthersBookDetail = (date,id) => {
    return function(dispatch) { 
        const options = {
            url:`bookshelf/other/bookDetail/${date}/${id}`,
            method:'GET',
        };
        axios(options).then((response) => {
            dispatch(setBookDetail(response.data.booksDiary))
        }).catch((err) => {
            console.log(err);
            if(err.response){
                console.log(err.response.data)
            }
        })
    }

}

const addQuest = (topic, contents) => {
    return function(){
        console.log(topic, contents)
        const options = {
            url:'bookshelf/question',
            method:'POST',
            data: {
                topic:topic,
                contents:contents
            }
        };
        axios(options).then((response)=> {
            console.log(response.data)

        }).catch((err) => {
            console.log(err)
            if(err.response){
                console.log(err.response.data)
            }
        })
    }
}

const getMyQuest = () => {
    return function(dispatch, getState){
        const page = getState().books.page;
        const next = getState().books.next;

        if(!next){
            console.log('next is none');
            return
        }

        const options = {
            url:`/bookshelf/question?page=${page}`,
            method:"GET"
        };
        axios(options).then(response => {
            console.log(response.data);
            if(!response.data.myQuestion.length){
                dispatch(setNext(false));
                window.alert('다음 질문이 없습니다.');
            }
            dispatch(setCustomQuestion(response.data.myQuestion))
            dispatch(setPage(page+1))
        }).catch(err => {
            console.log(err);
            if(err.response){
                console.log(err.response.data);
            };
        })
    }
}

const getOthersQuest = (id) => {
    return function(dispatch, getState){
        const page = getState().books.page;
        const next = getState().books.next;

        if(!next){
            console.log('next is none');
            return
        }

        const options = {
            url:`/bookshelf/other/${id}/question/?page=${page}`,
            method:"GET"
        };
        axios(options).then(response => {
            console.log(response.data);
            // if(!response.data.myQuestion.length){
            //     dispatch(setNext(false));
            //     window.alert('다음 질문이 없습니다.');
            // }
            // dispatch(setCustomQuestion(response.data.myQuestion))
            // dispatch(setPage(page+1))
        }).catch(err => {
            console.log(err);
            if(err.response){
                console.log(err.response.data);
            };
        })
    }
}



// const getCardAnswers = (date,question_id) => {
//     return function(dispatch){
//         const options = {
//             url:`/bookshelf/bookCardDetail/${date}/${question_id}`,
//             method:'GET',
//         }
//         axios(options).then((response) => {
//             console.log(response.data)
//             dispatch(setCardAnswers(response.data));
//         }).catch(err => {
//             console.log(err);
//             if(err.response){
//                 console.log(err.response.data)
//             }
//         })
//     }
// }


export const { 
    setBooks,
    changeDate,
    setComponent,
    // setSelect,
    setBookDetail,
    setPage,
    setNext,
    setCustomQuestion,
    resetCustiomQuestion,
    setPageOwner
    // setCardAnswers,
    // setOther
 } = booksSlice.actions;

export const api = {
    getBooks,
    getBookDetail,
    addQuest,
    // getCardAnswers,
    getOthersBooks,
    getOthersBookDetail,
    getMyQuest,
    getOthersQuest
};

export default booksSlice.reducer;
