import {
  Avatar,
  AvatarFallback
} from "@/components/ui/avatar";
import "./person.css";

function Person({username="User", color, isTyping}) {
    const extractInit = (name) => {
        // make an array
        let names = name.split(" ");
        if(names.length == 1) {
            return names[0].charAt(0).toUpperCase();
        } else {
            return names[0].charAt(0).toUpperCase() + names[1].charAt(0).toUpperCase();
        }
    }

    const adjustName = (name) => {
        if(name.length <= 14) return name;
        // else adjust it 
        return name.slice(0, 11) + "...";
    }

    let colors = [
        {bg: "#fca5a5", letter: "#450a0a"},
        {bg: "#fde047", letter: "#422006"},
        {bg: "#6ee7b7", letter: "#022c22"},
        {bg: "#67e8f9", letter: "#083344"},
        {bg: "#d8b4fe", letter: "#3b0764"}
    ]

  return (
    <>
        <div className="person-box">
            <Avatar>
                <AvatarFallback style={{
                    backgroundColor: colors[color].bg,
                    color: colors[color].letter
                }}>{
                    (!isTyping)? extractInit(username) : (
                        <span className="loading loading-dots loading-md"></span>
                    )
                }</AvatarFallback>
            </Avatar>
            <h1 className="username">{adjustName(username)}</h1>
        </div>
    </>
  )
}

export default Person