import { useState, useEffect } from "react";
import { authenticateCeramic } from "../utils";
import { useCeramicContext } from "../context";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.scss";

type Profile = {
  [key: string]: any;
  id?: any;
  name?: string;
  username?: string;
  description?: string;
  gender?: string;
  emoji?: string;
};

const Home: NextPage = () => {
  const clients = useCeramicContext();
  const { ceramic, composeClient } = clients;
  const [loggedIn, setLoggedIn] = useState(false);
  const [profile, setProfile] = useState<Profile | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    await authenticateCeramic(ceramic, composeClient);
    await getProfile();
  };

  const getProfile = async () => {
    setLoading(true);
    if (ceramic.did !== undefined) {
      const profile: Profile = await composeClient.executeQuery(`
        query {
          viewer {
            basicProfile {
              id
              name
              username
              description
              gender
              emoji
            }
          }
        }
      `);
      setProfile(profile?.data?.viewer?.basicProfile);
      setLoading(false);
    }
  };

  const newPosts = {
    8: {
        profileId: "k2t6wzhkhabz190qvb93kwykhd6t8yk3b8pj6qeunq4bv1qvo7mhg507ct87l5",
        body: "AI will reshape our lives! 🤖🌐",
        tag: "AI",
        created: "2020-06-18T13:20:00Z"
    },
    9: {
        profileId: "k2t6wzhkhabz190qvb93kwykhd6t8yk3b8pj6qeunq4bv1qvo7mhg507ct87l5",
        body: "Renewable energy is the future! ☀️🌿",
        tag: "RenewableEnergy",
        created: "2021-04-09T16:45:00Z"
    },
    10: {
        profileId: "k2t6wzhkhabz190qvb93kwykhd6t8yk3b8pj6qeunq4bv1qvo7mhg507ct87l5",
        body: "Space exploration is essential! 🚀🌌",
        tag: "Space",
        created: "2019-08-15T11:30:00Z"
    },
    11: {
        profileId: "k2t6wzhkhabz190qvb93kwykhd6t8yk3b8pj6qeunq4bv1qvo7mhg507ct87l5",
        body: "AI ethics are complex but vital! 🤖🤔",
        tag: "AI",
        created: "2021-11-05T14:15:00Z"
    },
    12: {
        profileId: "k2t6wzhkhabz190qvb93kwykhd6t8yk3b8pj6qeunq4bv1qvo7mhg507ct87l5",
        body: "Clean water tech excites me! 💧🌍",
        tag: "Technology",
        created: "2020-07-20T09:50:00Z"
    },
    13: {
        profileId: "k2t6wzhkhabz190qvb93kwykhd6t8yk3b8pj6qeunq4bv1qvo7mhg507ct87l5",
        body: "Automation reshapes jobs! 🤖💼",
        tag: "Automation",
        created: "2019-03-28T12:40:00Z"
    },
    14: {
        profileId: "k2t6wzhkhabz190qvb93kwykhd6t8yk3b8pj6qeunq4bv1qvo7mhg507ct87l5",
        body: "I champion green architecture! 🏡🌿",
        tag: "Sustainability",
        created: "2018-09-17T15:25:00Z"
    },
    15: {
        profileId: "k2t6wzhkhabz190qvb93kwykhd6t8yk3b8pj6qeunq4bv1qvo7mhg507ct87l5",
        body: "Quantum computing fuels innovation! 🧮🌐",
        tag: "Technology",
        created: "2023-03-21T14:55:00Z"
    }
};

  const createPost = async () => {
    setLoading(true);
    // console.log(alexThompsonPosts[1].body)
    for(let i = 8; i < 16; i++){
        await new Promise((resolve) => setTimeout(resolve, 100));
        const follow = await composeClient.executeQuery(`
        mutation {
          createPosts(input: {
            content: {
              profileId: "${newPosts[i].profileId}"
              body: "${newPosts[i].body}"
              tag: "${newPosts[i].tag}"
              created: "${newPosts[i].created}"
            }
          }) 
          {
            document {
              profileId
              author{
                id
              }
            }
          }
        }
      `);
        console.log(follow);
    }
        
      
      setLoading(false);
    
  };

  const updateProfile = async () => {
    setLoading(true);
    if(profile){
      if(profile.username){
        if(profile.username.length < 5){
          alert('Username must be greater than 5 characters');
          setLoading(false);
          return;
        }
      }
      
    }
    if (ceramic.did !== undefined) {
      const update = await composeClient.executeQuery(`
        mutation {
          createBasicProfile(input: {
            content: {
              name: "${profile?.name}"
              username: "${profile?.username}"
              description: "${profile?.description}"
              gender: "${profile?.gender}"
              emoji: "${profile?.emoji}"
            }
          }) 
          {
            document {
              name
              username
              description
              gender
              emoji
            }
          }
        }
      `);
      console.log(update)
      if (update.errors) {
        setLoading(false);
        alert(update.errors);
      } else {
        alert("Updated profile.");
        setLoading(false);
        const updatedProfile: Profile = await composeClient.executeQuery(`
        query {
          viewer {
            basicProfile {
              id
              name
              username
              description
              gender
              emoji
            }
          }
        }
      `);
        setProfile(updatedProfile?.data?.viewer?.basicProfile);
        const followSelf = await composeClient.executeQuery(`
        mutation {
          createFollowing(input: {
            content: {
              profileId: "${updatedProfile?.data?.viewer?.basicProfile.id}"
            }
          }) 
          {
            document {
              profileId
            }
          }
        }
      `);
        console.log(followSelf);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("did")) {
      handleLogin();
    } else {
      setLoggedIn(false);
    }
  }, []);

  return (
    <div className={styles.homeContainer}>
      {profile === undefined && ceramic.did === undefined ? (
        <div  style={{ display: "flex", justifyContent: "center" }}>
          <button
            onClick={() => {
              handleLogin();
            }}
            style={{
              width: "5rem",
              backgroundColor: "transparent",
              borderStyle: "groove",
              borderWidth: ".01rem",
              borderColor: "orange",
            }}
          >
            Login
          </button>
        </div>
      ) : (
        <div
          style={{
            margin: "15rem auto",
            alignContent: "center",
            textAlign: "left",
          }}
        >
          <div style={{ width: "100%", height: "3rem", margin: "auto" }}>
            <label className="">Name</label>
            <input
              className=""
              type="text"
              style={{
                display: "inline-block",
                float: "right",
                width: "60%",
                backgroundColor: "#292828",
                color: "white",
              }}
              defaultValue={profile?.name || ""}
              onChange={(e) => {
                setProfile({ ...profile, name: e.target.value });
              }}
            />
          </div>
          <div style={{ width: "100%", height: "3rem" }}>
            <label>Username</label>
            <input
              style={{
                display: "inline-block",
                float: "right",
                width: "60%",
                backgroundColor: "#292828",
                color: "white",
              }}
              type="text"
              defaultValue={profile?.username || ""}
              onChange={(e) => {
                setProfile({ ...profile, username: e.target.value });
              }}
            />
          </div>
          <div style={{ width: "100%", height: "3rem" }}>
            <label>Description</label>
            <input
              style={{
                display: "inline-block",
                float: "right",
                width: "60%",
                backgroundColor: "#292828",
                color: "white",
              }}
              type="text"
              defaultValue={profile?.description || ""}
              onChange={(e) => {
                setProfile({ ...profile, description: e.target.value });
              }}
            />
          </div>
          <div style={{ width: "100%", height: "3rem" }}>
            <label>Gender</label>
            <input
              style={{
                display: "inline-block",
                float: "right",
                width: "60%",
                backgroundColor: "#292828",
                color: "white",
              }}
              type="text"
              defaultValue={profile?.gender || ""}
              onChange={(e) => {
                setProfile({ ...profile, gender: e.target.value });
              }}
            />
          </div>
          <div className="">
            <label>Emoji</label>
            <input
              style={{
                display: "inline-block",
                float: "right",
                width: "60%",
                backgroundColor: "#292828",
                color: "white",
              }}
              type="text"
              defaultValue={profile?.emoji || ""}
              onChange={(e) => {
                setProfile({ ...profile, emoji: e.target.value });
              }}
              maxLength={2}
            />
          </div>
          <br></br>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              onClick={() => {
                createPost();
              }}
              style={{
                width: "8rem",
                backgroundColor: "transparent",
                borderStyle: "groove",
                borderWidth: ".01rem",
                borderColor: "orange",
              }}
            >
              {loading ? "Loading..." : "Create Post"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default Home;
