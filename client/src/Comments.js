import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "./UserContext";


export default function Comments() {

  const [commentInfo,setCommentInfo] = useState(null);
  const {userInfo} = useContext(UserContext);
  const {id} = useParams();

  useEffect(() => {
    fetch(`http://localhost:4000/comment/${id}`)
      .then(response => {
        response.json().then(commentInfo => {
          setCommentInfo(commentInfo);
        });
      });
  }, []);

  return(

    <>
    helo
    </>
  );
  }