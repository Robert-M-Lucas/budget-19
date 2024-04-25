import {collection, doc, DocumentSnapshot, getDoc, setDoc, SnapshotOptions} from "firebase/firestore";
import {User} from "firebase/auth";
import {db} from "./firebase.ts";


export class UserPrefs {
    public goal: number;

    constructor(goal: number) {
        this.goal = goal;
    }

    static default(): UserPrefs {
        return new UserPrefs(100);
    }

    // Utility method for creating `Transactions`
    static fromFirestore(snapshot: DocumentSnapshot, options: SnapshotOptions): UserPrefs {
        const data = snapshot.data(options);
        if (!data) {
            throw Error("No data returned for snapshot!");
        }
        const u = new UserPrefs(data.goal);
        return u;
    }

    toSendObject(): object {
        const {...transObject} = this;
        return transObject;
    }
}

export async function getUserPrefs(user: User): Promise<UserPrefs> {
    const docRef = doc(collection(db, "UserPrefs"), user.uid);

    return await getDoc(docRef).then((ds) =>
        UserPrefs.fromFirestore(ds, {})
    ).catch(() => UserPrefs.default());
}

export async function setUserPrefs(user: User, prefs: UserPrefs): Promise<void> {
    const docRef = doc(collection(db, "UserPrefs"), user.uid);
    await setDoc(docRef, prefs.toSendObject());
}
