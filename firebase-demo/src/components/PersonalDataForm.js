import { useContext, useEffect } from "react";
import { Context } from '@context';
import { db } from "@database";
import { doc, updateDoc, serverTimestamp, getDoc, setDoc } from "firebase/firestore";

export const LoginReward = () => {
  const { parent, setParent } = useContext(Context); // Retrieving parent's rewardData

  function getReward() {
    if (!parent || !parent.parentId) {
      console.log("Parent document does not exist.");
      return;
    }

    const parentDocRef = doc(db, "parents", parent.parentId);

    getDoc(parentDocRef)
      .then((parentDocSnapshot) => {
        if (!parentDocSnapshot.exists()) {
          console.log("Parent document does not exist.");
          return;
        }

        const rewardData = parentDocSnapshot.data();
        const lastRewardTime = rewardData.lastRewardTime;
        const currentTime = Date.now();
        const minute = 1000 * 60;

        // If last reward was never given or lastRewardTime is null
        if (!lastRewardTime) {
          setDoc(parentDocRef, {
            reward: 1,
            lastRewardTime: currentTime,
          }, { merge: true })
            .then(() => {
              console.log("Reward updated successfully for the first time.");
            })
            .catch((error) => {
              console.error("Error updating reward:", error);
            });
        } else {
          const timeDifference = currentTime - lastRewardTime;
          if (timeDifference >= minute) {
            updateDoc(parentDocRef, {
              reward: rewardData.reward + 1,
              lastRewardTime: currentTime
            })
              .then(() => {
                console.log("Reward incremented successfully.");
              })
              .catch((error) => {
                console.error("Error updating reward:", error);
              });
          } else {
            console.log(`You need to wait ${Math.ceil((minute - timeDifference) / 1000)} more seconds.`);
          }
        }

        // Log waiting time outside the conditions
        if (lastRewardTime) {
          console.log(`You need to wait ${Math.ceil((minute - (currentTime - lastRewardTime)) / 1000)} more seconds.`);
        }
      })
      .catch((error) => {
        console.error("Error fetching parent document:", error);
      });
  }

  useEffect(() => {
    getReward();
  }, []);

  return null; // Since this component is responsible for side effects only, return null
}
