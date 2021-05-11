import React from 'react';
import styled from 'styled-components';
import {BookShelf, Profile, OthersQuestion, OthersAnswers} from '../components/Books/booksindex';
import {api as userActions} from '../redux/modules/user';
import {useSelector, useDispatch} from 'react-redux';
import { getCookie } from "../shared/Cookie";
import {changeDate, setComponent} from '../redux/modules/books';
import { changeType } from '../redux/modules/community'

const OthersBooks = (props) => {
    const dispatch = useDispatch();
    const userId = props.match.params.id;
    const component = useSelector(state => state.books.component);
    const date = useSelector(state => state.books.date);
    const formated_date = useSelector(state => state.books.formated_date);
    const answerInfo = useSelector((state) => state.community.card_detail);
    const cookie = getCookie("is_login") ? true : false;
    let url = window.location.href.split('/');
    console.log(url)
    let id = url[url.length -2];
    let others_id = url[url.length -1];
    

    React.useEffect(() => {
        dispatch(changeDate(0))
        dispatch(setComponent(''))
        if(cookie){
            dispatch(userActions.myFollowListAX())
        }
        return()=>{
            if(answerInfo.length !== 0){
                dispatch(changeType(null))
            }
        }
    },[])

    React.useEffect(() => {
        dispatch(userActions.othersInfoAX(userId))
        dispatch(userActions.otherFriendListAX(userId))
    },[userId])

    return(
        <React.Fragment>
            <Container>
                <ContainerBox>
            <ProfileContainer>
                <Profile id={userId} />
            </ProfileContainer>
                {id === 'others' && component === '' &&
                <BookShelf date={date}/>
                }
                {component === 'othersquestion' && <OthersQuestion/>}
                {component === 'othersanswers' && <OthersAnswers/>}
                </ContainerBox>
                <ImgLeft/>
            <ImgRight/>
            </Container>
        </React.Fragment>
    )
}



const ContainerBox = styled.div`
    height: 100vh;
    margin: 100px 0px 0px 0px;
    padding-left: 20px;
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    @media(max-width:750px){
        padding-left:0px;
        overflow-x:hidden;
    }
    ::-webkit-scrollbar {
    display: none;
    };
`

const Container = styled.div`
    width: 100%;
    display:flex;
    flex-direction:column;
    justify-content:space-between;
    overflow:auto;
    ::-webkit-scrollbar {
    display:none;
    width: 10px; /* width of the entire scrollbar */
  }

  ::-webkit-scrollbar-track {
    display:none;
    background: none; /* color of the tracking area */
  }

  ::-webkit-scrollbar-thumb {
    display:none;
    background-color: #ffffff; /* color of the scroll thumb */
    border-radius: 20px; /* roundness of the scroll thumb */
  }
    @media (max-width:1040px){
    margin:0px 10px;
}
@media(max-width:900px){
        padding-bottom:80px;
    }
`;

const ProfileContainer = styled.section`
    position:relative;
    box-sizing:border-box;
    padding:30px;
    width: 100%;
    margin: auto;
    margin-top: 70px;
    max-width:988px;
    min-height:190px;
    display: flex;
    flex-direction: row;
    @media(max-width:500px){
        padding:10px;
        min-height:150px;
    }
`;

const ImgRight = styled.div`
    z-index:25;
    position:fixed;
    background-image:url('https://user-images.githubusercontent.com/77574867/116996886-0c785d80-ad17-11eb-9afd-175a104b7f33.png');
    background-size:contain;
    background-repeat:no-repeat;
    right:-70px;
    bottom:-13px;
    width:593px;
    height:731px;
    opacity:0.8;
    pointer-events: none;
    @media (max-width:1400px){
        display:none;
    }
    
`;


const ImgLeft = styled.div`
    z-index:25;
    position:fixed;
    background-image:url('https://user-images.githubusercontent.com/77574867/116996878-0b473080-ad17-11eb-8910-108950e25cb8.png');
    background-size:contain;
    background-repeat:no-repeat;
    left:-20px;
    top:249px;
    width:365px;
    height:341px;
    opacity:0.8;
    pointer-events: none;
    @media (max-width:1400px){
        display:none;
    }
`;

export default OthersBooks;