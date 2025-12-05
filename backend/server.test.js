import { io as Client } from "socket.io-client";
import { expect, describe, it, beforeAll, afterAll } from "@jest/globals";
import { server } from "./server.js";

let clientSocket1, clientSocket2, clientSocket3;
let httpServer;
let port;

beforeAll((done) => {
  // Start the server on a random free port
  httpServer = server.listen(0, () => {
    port = httpServer.address().port;
    
    // Setup clients
    clientSocket1 = Client(`http://localhost:${port}`);
    clientSocket2 = Client(`http://localhost:${port}`);
    clientSocket3 = Client(`http://localhost:${port}`);
    
    // Wait for all to connect
    let connected = 0;
    const onConnect = () => {
      connected++;
      if (connected === 3) done();
    };

    clientSocket1.on("connect", onConnect);
    clientSocket2.on("connect", onConnect);
    clientSocket3.on("connect", onConnect);

    setTimeout(done, 1000);
  });
});

afterAll(() => {
  clientSocket1.close();
  clientSocket2.close();
  clientSocket3.close();
  httpServer.close();
});

describe("Socket.io Server Tests", () => {
  const roomId = "test-room-123";
  const otherRoomId = "other-room-456";
  const user1 = { meeting_id: roomId, userName: "UserOne", unique_id: "u1" };
  const user2 = { meeting_id: roomId, userName: "UserTwo", unique_id: "u2" };
  const user3 = { meeting_id: otherRoomId, userName: "UserThree", unique_id: "u3" };

  // 1. Join
  it("should allow a user to join a room and notify others", (done) => {
    // client2 joins first
    clientSocket2.emit("joined", user2);

    // Listen for newJoin on client2 when client1 joins
    clientSocket2.on("newJoin", (user) => {
      if (user.userName === user2.userName) return; // Ignore self join
      expect(user.userName).toBe(user1.userName);
      clientSocket2.off("newJoin");
      done();
    });

    // client1 joins
    setTimeout(() => {
        clientSocket1.emit("joined", user1);
    }, 50);
  }, 20000);

  // 2. Sync Code
  it("should sync code changes to other users in the room", (done) => {
    const newCode = "console.log('Hello World');";

    clientSocket2.on("newCode", (code) => {
      expect(code).toBe(newCode);
      clientSocket2.off("newCode");
      done();
    });

    clientSocket1.emit("change", { room_id: roomId, val: newCode });
  });

  // 3. Leave
  it("should notify when a user leaves the room", (done) => {
    clientSocket2.on("disconnect_user", (remainingUsers) => {
      const user1Found = remainingUsers.find(u => u.unique_id === user1.unique_id);
      expect(user1Found).toBeUndefined();
      
      clientSocket2.off("disconnect_user");
      done();
    });

    clientSocket1.emit("leave", { u_id: user1.unique_id, room_id: roomId });
  });

  // 4. All Users
  it("should receive list of all users upon joining", (done) => {
    // client1 joins again (was left in prev test)
    clientSocket1.emit("joined", user1);

    clientSocket1.on("allUsers", (users) => {
        // Should contain user2 (already in room) and user1 (joining)
        const u2 = users.find(u => u.userName === user2.userName);
        const u1 = users.find(u => u.userName === user1.userName);
        expect(u2).toBeDefined();
        expect(u1).toBeDefined();
        clientSocket1.off("allUsers");
        done();
    });
  });

  // 5. Existing Content
  it("should receive existing room content upon joining", (done) => {
     // Set some content first via client1
     const content = "Existing Content";
     clientSocket1.emit("change", { room_id: roomId, val: content });
     
     // Wait for change to process
     setTimeout(() => {
         // New user (client3) joins same room
         const user4 = { meeting_id: roomId, userName: "UserFour", unique_id: "u4" };
         
         clientSocket3.emit("joined", user4);
         
         clientSocket3.on("getContent", (val) => {
             expect(val).toBe(content);
             clientSocket3.off("getContent");
             
             // Leave to clean up and WAIT for it to complete
             // client1 should receive disconnect_user
             clientSocket1.on("disconnect_user", () => {
                 clientSocket1.off("disconnect_user");
                 done();
             });
             
             clientSocket3.emit("leave", { u_id: user4.unique_id, room_id: roomId });
         });
     }, 50);
  });

  // 6. Isolation
  it("should not receive events from other rooms", (done) => {
      // client3 joins OTHER room
      clientSocket3.emit("joined", user3);
      
      // client3 listens for newCode
      let received = false;
      clientSocket3.on("newCode", () => {
          received = true;
      });
      
      // client1 changes code in roomId
      clientSocket1.emit("change", { room_id: roomId, val: "Leaky Code" });
      
      setTimeout(() => {
          expect(received).toBe(false);
          clientSocket3.off("newCode");
          done();
      }, 200);
  });

  // 7. Cleanup
  it("should clean up room when last user leaves", (done) => {
      const tempRoom = "temp-room";
      const uTemp = { meeting_id: tempRoom, userName: "Temp", unique_id: "ut" };
      
      // Join and set content
      clientSocket1.emit("joined", uTemp);
      clientSocket1.emit("change", { room_id: tempRoom, val: "Secret" });
      
      // Leave
      clientSocket1.emit("leave", { u_id: uTemp.unique_id, room_id: tempRoom });
      
      // Join again after a bit
      setTimeout(() => {
          clientSocket1.emit("joined", uTemp);
          
          let receivedContent = false;
          clientSocket1.on("getContent", () => {
              receivedContent = true;
          });
          
          setTimeout(() => {
              expect(receivedContent).toBe(false);
              clientSocket1.off("getContent");
              done();
          }, 200);
      }, 100);
  });
});