
"use client";
import { NextRequest, NextResponse } from "next/server";

const openRoutes = ["/login"];
export default function middleware(req: NextRequest) {
    const userToken = req.cookies.get("token");
    let absoluteUrl = null;
    if (
        !userToken &&
        !openRoutes.includes(req?.nextUrl?.pathname)
    ) {
        absoluteUrl = new URL("/login", req.nextUrl.origin);
        // console.warn(absoluteUrl);
        return NextResponse.redirect("/login");
    }
    
    return NextResponse.next();
    
}
