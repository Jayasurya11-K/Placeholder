import React, { useMemo, useState } from "react";
import { Box, Button, Card, CardActions, CardContent, CardHeader, Dialog, DialogActions, DialogContent, DialogProps, Grid, Pagination, SelectChangeEvent, TextField, ToggleButton, Typography } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};
type Comment = {
  postId: number,
    id: number,
    name: string,
    email: string,
    body: string
};

const App = () => {
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const {data: postdata, isLoading, isError, error, isPlaceholderData} = useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: async () => {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts`);
     const data = await response.json()
     return data
    },
  });
  const {data: commentdata} = useQuery<Comment[]>({
    queryKey: ['comments', id],
    queryFn: async () => {
      const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${id}`);
     const data = await response.json()
     return data
    },
  });
  const deletePost = (id: number) => {
    return fetch(`https://jsonplaceholder.typicode.com/posts/${id}`,{
    method: "DELETE"
   })
  }
//mutation
const queryClient = useQueryClient();
const deleteMutation = useMutation({
  mutationFn: deletePost,
  // onSuccess: (postdata, variables) => {
    // console.log(data, id)
    // queryClient.invalidateQueries({ queryKey: ['posts'] })
    // queryClient.setQueryData(['posts'], postdata)
// }
    onSuccess: (_, id) =>{
queryClient.setQueryData(['posts'], (oldPosts: any)=>{
  return oldPosts? oldPosts.filter((post: any) => post.id !== id) : [];
})
    }
   });
  

  const posts = useMemo(() => {
    return postdata || []
  }, [postdata])

  const comments = useMemo(() => {
    return commentdata || []
  }, [commentdata])

if(isLoading) return <Typography variant="h6">Loading...</Typography>
if(isError) return <Typography variant="h6">Something went wrong!...</Typography>

  return (
    <>
    <Typography variant="h3" style={{textAlign: "center"}}>All Posts</Typography>
    <div>
      {posts.map((post) => (
       <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
       {Array.from(Array(1)).map((_, index) => (
         <Grid item xs={12} sm={4} md={4} key={index}>
        <Card  sx={{ display: 'flex' }}variant="outlined" style={{ padding: "10px", margin: "5px", backgroundColor: "#f2f2f2", borderRadius: "6px"}}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent>
          {/* <Typography gutterBottom variant="h5" component="div">
        {post.title}</Typography> */}
        <CardHeader title={post.title} style={{paddingLeft: "0px"}}></CardHeader>
        <Typography>{post.body}</Typography>
        <Typography>{post.id}</Typography>
        </CardContent>
        <CardActions>
        {/* <Button href={`https://jsonplaceholder.typicode.com/posts/${post.id}`} target = "_blank">Learn More</Button> */}
       
        <React.Fragment>
        <Button  onClick={handleClickOpen}>View Comments</Button>
        </React.Fragment>
        <React.Fragment>
        <Button onClick={()=>deleteMutation.mutate(post.id)}>Delete</Button>
        </React.Fragment>
      </CardActions>
        </Box>
        </Card>
        </Grid>
        ))}
      </Grid>
      ))}
    </div>
    <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogContent>
        {comments.map((comment) => (
           <Card key={comment.postId}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            
            <Typography>{comment.body}</Typography>
             
            </Box>
           </Card>
        ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
);
};

export default App;
