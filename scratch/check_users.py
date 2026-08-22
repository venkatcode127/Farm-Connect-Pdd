import sys
import os
sys.path.append(os.path.abspath('backend'))
import asyncio
from database import user_collection

async def main():
    users = await user_collection.find({}, {'phone': 1, 'name': 1, 'role': 1, 'password': 1}).to_list(10)
    for u in users:
        print(f"Phone: {u.get('phone')}, Name: {u.get('name')}, Role: {u.get('role')}, Password: {u.get('password')}")

if __name__ == '__main__':
    asyncio.run(main())
