import { expect } from "@playwright/test";
import { deleteRoom } from "./deleteRoom";
import { getRoomsAdmin } from "./getRooms";

export async function roomsCleanUp() {
  let rooms = await getRoomsAdmin();

  if (rooms.length > 0) {
    for (let i = 0; i < rooms.length; i++) {
      await deleteRoom(rooms[i].roomid);
    }
  }

  let roomsUpdated = await getRoomsAdmin();
  expect(roomsUpdated.length).toBe(0);
}
