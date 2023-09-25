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

  const taylorGarciaPosts = {
    0: {
      profileId:
        "k2t6wzhkhabz10s2wk66g46zu0o21yp70jrikvbx9q7qo9f5p8ohzzim90y4ku",
      body: "Open source: tech's future? Let's chat!",
      tag: "OpenSource",
      created: "2022-04-10T08:30:00Z",
    },
    1: {
      profileId:
        "k2t6wzhkhabz10s2wk66g46zu0o21yp70jrikvbx9q7qo9f5p8ohzzim90y4ku",
      body: "Funding open source? Thoughts? 💭💸",
      tag: "Funding",
      created: "2022-06-18T12:15:00Z",
    },
    2: {
      profileId:
        "k2t6wzhkhabz10s2wk66g46zu0o21yp70jrikvbx9q7qo9f5p8ohzzim90y4ku",
      body: "Supporting open source heroes? 💻💪",
      tag: "OpenSource",
      created: "2022-09-02T17:45:00Z",
    },
    3: {
      profileId:
        "k2t6wzhkhabz10s2wk66g46zu0o21yp70jrikvbx9q7qo9f5p8ohzzim90y4ku",
      body: "Open source's budget impact? 🌍🚀",
      tag: "Funding",
      created: "2023-01-25T09:10:00Z",
    },
    4: {
      profileId:
        "k2t6wzhkhabz10s2wk66g46zu0o21yp70jrikvbx9q7qo9f5p8ohzzim90y4ku",
      body: "Contributions with rewards? 🍰💡",
      tag: "OpenSource",
      created: "2023-04-05T14:30:00Z",
    },
    5: {
      profileId:
        "k2t6wzhkhabz10s2wk66g46zu0o21yp70jrikvbx9q7qo9f5p8ohzzim90y4ku",
      body: "Accessible tech piggy bank? 🐷🏦",
      tag: "Funding",
      created: "2023-07-18T19:05:00Z",
    },
    6: {
      profileId:
        "k2t6wzhkhabz10s2wk66g46zu0o21yp70jrikvbx9q7qo9f5p8ohzzim90y4ku",
      body: "More devs in open source? 🚀🗺️",
      tag: "OpenSource",
      created: "2023-09-30T10:20:00Z",
    },
    7: {
      profileId:
        "k2t6wzhkhabz10s2wk66g46zu0o21yp70jrikvbx9q7qo9f5p8ohzzim90y4ku",
      body: "Sustainable support: reality? 🌱",
      tag: "Funding",
      created: "2023-12-12T15:40:00Z",
    },
  };

//   const getPosts = async () => {
//     setLoading(true);
//     // console.log(alexThompsonPosts[1].body)
//     const posts = await composeClient.executeQuery(`
//         query{
//             postsIndex(first: 100){
//                 edges{
//                     node{
//                         id
//                         body
//                         created
//                     }
//                 }
//             }
//         }
//       `);
//     console.log(posts.data.postsIndex.edges);
//     const requestOptions = {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(posts.data.postsIndex.edges),
//     };

//     const returnItems = await fetch("/api/route", requestOptions).then(
//       (response) => response.json()
//     );
//     console.log(returnItems)

//     for(let i = 0; i < 39; i++){
//         await new Promise((resolve) => setTimeout(resolve, 100));
//         const comment = await composeClient.executeQuery(`
//         mutation {
//           createComments(input: {
//             content: {
//               profileId: "k2t6wzhkhabz10s2wk66g46zu0o21yp70jrikvbx9q7qo9f5p8ohzzim90y4ku"
//               comment: "${returnItems[i].response}"
//               postId: "${returnItems[i].id}"
//               created: "${returnItems[i].date}"
//             }
//           }) 
//           {
//             document {
//               profileId
//               id
//               comment
//               created
//             }
//           }
//         }
//       `);
//         console.log(comment);
//     }

//     setLoading(false);
//   };

const getPosts = async () => {
    setLoading(true);
   console.log('hello')
    const posts = await composeClient.executeQuery(`
    query{
        postsIndex(last: 10){
          edges{
            node{
              body
              responses(first: 5){
                edges{
                    node{
                        id
                        comment
                    }
                }
              }
            }
          }
        }
      }
      `);
    console.log(posts)

    setLoading(false);
  };
  const updateProfile = async () => {
    setLoading(true);
    if (profile) {
      if (profile.username) {
        if (profile.username.length < 5) {
          alert("Username must be greater than 5 characters");
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
      console.log(update);
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
        <div style={{ display: "flex", justifyContent: "center" }}>
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
                getPosts();
              }}
              style={{
                width: "8rem",
                backgroundColor: "transparent",
                borderStyle: "groove",
                borderWidth: ".01rem",
                borderColor: "orange",
              }}
            >
              {loading ? "Loading..." : "Create Comments"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default Home;

