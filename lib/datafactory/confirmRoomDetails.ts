import { expect } from "@playwright/test";
import { getRoomByIdAdmin, getRoomByIdPublic } from "./getRoomById";
import { getRoomsAdmin, getRoomsPublic } from "./getRooms";

export async function confirmRoomDetails(roomToCheck) {
  // check if admin&public /room/id endpoint has room details
  let roomByIdAdmin = await getRoomByIdAdmin(roomToCheck.roomid);
  expect(roomByIdAdmin).toEqual(roomToCheck);

  let roomByIdPublic = await getRoomByIdPublic(roomToCheck.roomid);
  expect(roomByIdPublic).toEqual(roomToCheck);

  // check if admin&public /room endpoint has room details
  let roomsAdmin = await getRoomsAdmin();
  let roomAdmin = roomsAdmin.filter(
    (room) => room.roomid === roomToCheck.roomid
  )[0];
  expect(roomAdmin).toEqual(roomToCheck);

  let roomsPublic = await getRoomsPublic();
  let roomPublic = roomsPublic.filter(
    (room) => room.roomid === roomToCheck.roomid
  )[0];
  expect(roomPublic).toEqual(roomToCheck);
}
