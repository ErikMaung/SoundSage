import { useNavigate, useParams, Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { useState, useEffect } from "react";
import { useTheme } from '@mui/system';
import { Box, Card, CardContent, CardMedia, Typography, Button, IconButton, Paper, TextField } from '@mui/material';
import { getPost, addLike, createPost } from '../utilities/backend_integration.js';
import { getUserData } from '../utilities/backend_integration.js';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import SendIcon from '@mui/icons-material/Send';


const BlogPage = () => {
    const { id } = useParams();
    
    const [isPending, setIsPending] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [blog, setBlog] = useState(0);
    const navigate = useNavigate();
    const theme = useTheme()
    const [likes,setLikes] = useState(0);
    const [title, setTitle] = useState(' ');
    const [body, setBody] = useState('');
    const [author, setAuthor] = useState('Default');
    const [song, setSong] = useState(' ');
    const [children, setChildren] = useState([]);
    const [data, setData] = useState(null)
    const [error, setError] = useState(null);
    const [liked, setLiked] = useState(false);

    //console.log(id)
    useEffect(() => {
        console.log('id:' + id)
        getUserData()
        .then(data => {
            setData(data);
            setError(null);
          })
          .catch(error => {
            setData(null);
            setError(error);
          })
        getPost(id)
        .then((res) => {
            //console.log(res)
            setBlog(res)
            setLikes(res.num_of_likes)
            console.log(res.children.length)
            for(var i = 0; i < res.children.length; i++) {
                getPost(res.children[i])
                .then((res) => {
                    setChildren((oldChildren) => {return oldChildren.concat(res)})
                })
            }
            setIsLoading(false)
            console.log('blogLikes' + blog)
        })
    }, []);

    //console.log('blog:' + blog)

    const handleLike = () => {
        //const blog = blog?.blogs[0].id
        if (!liked && !blog.liked_users.includes(data.spotify_id)) {
            addLike(blog._id)
            .then(() => {
                setLikes(likes+1)
            })
        }
        setLiked(true)
        console.log("liked" + liked)
        //fetch('http://localhost:8080/getPosts', {
        //    method: 'LIKE'
        //}).then(() => {
        //    
        //})
    }

    const handleSubmit = (e) => {
        console.log(blog)
        e.preventDefault();
        setTitle('Replying to ' + blog.user_name)
        const parent = blog._id
        const comment = { title, body, song, parent };
        console.log('This is my comment' + comment)

        setIsPending(true);
        console.log('this too' + comment)
        createPost(comment)
        .then(() => {
            console.log('NEW COMMENT ADDED');
            setIsPending(false);
            // navigate.go(-1);
            navigate('/');
        })

    const handleChildren = () => {

    }
}

    return (
        <div className="blog-details" style ={{color: theme.palette.text.main }}>
            <Box
                position = "fixed"
                bottom = {0}
                width = "100%"
                style = {{ backgroundColor: theme.palette.secondary.main}}
                p={3}
            />
            { isLoading && <div>Loading...</div> }
            { blog && (
                <article style={{ textAlign: 'center', fontFamily: 'monospace' }}>
                    <h2 style={{ marginTop: '30px' }}> {blog.post_title} </h2>
                    <Link to={`/profile/${blog.user_id}`}>
                    <p style={{color: theme.palette.subtext.main }}><em>Written by: <b>{blog.user_name}</b></em></p>
                    </Link>
                    <p>{blog.post_body}</p>
                    <Card style={{ maxWidth: '400px', margin: 'auto' }}>
                        <CardMedia
                            component="img"
                            maxWidth='400px'
                            image={blog.song_pic}
                            alt="album image"
                        />
                        <CardContent>
                            <Typography variant="h6">{blog.song_name}</Typography>
                        </CardContent>
                    </Card>
                    <Button
                        onClick={handleLike}
                        variant="contained"
                        startIcon={<ThumbUpAltIcon />}
                        style={{ marginTop: '20px' }}
                    >
                        {`Likes: ${likes}`}
                    </Button>
                </article>
            )}

            <Paper elevation={3} style={{ padding: '20px', marginTop: '20px', marginBottom: '50px' }}>
                <Typography variant="h5" gutterBottom style={{ textAlign: 'center', fontFamily: 'monospace'}}>
                    Leave a Comment
                </Typography>
                <form onSubmit={handleSubmit} style={{ color: theme.palette.text.main, width: '60%', margin: 'auto', flexDirection: 'column'}}>
                <TextField
                    label="Comment"
                    variant="outlined"
                    multiline
                    rows={5}
                    fullWidth
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    required
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<SendIcon />}
                    style={{ marginTop: '10px', fontFamily: 'monospace', alignSelf: 'flex-end'}}
                >
                    Add Comment
                </Button>
                </form>
            </Paper>


            
            {/*<div className='create'>
            <h1 className='page_header'>Comment</h1>
            <form onSubmit={handleSubmit} style={{ color: theme.palette.text.main }}>
                <label>Comment:</label>
                <textarea 
                    required
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                ></textarea>
                { !isPending && <button>Add Comment</button>}
                { isPending && <button disabled>Posting...</button>}
                {/*<p>{ title }</p>
                <p>{body}</p>
                <p>{author}</p>*/}
            


        {children?.length > 0 && (
            <div>
                {children?.map((child) => (
                    <>
                    <h1>{child.post_body}</h1>
                    <p>{child.user_name}</p>
                    </>
                ))}
            </div>
        )}
        </div>
    );
}
 
export default BlogPage;