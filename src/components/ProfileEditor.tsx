import { useState } from 'react'

interface UserProfile {
  name: string
  email: string
  bio: string
}

export function ProfileEditor() {
  const [profile, setProfile] = useState<UserProfile>({
    name: '홍길동',
    email: 'gildong@react.com',
    bio: '리액트 공부 중',
  })

  const handleUpdate = (changes: Partial<UserProfile>) => {
    setProfile((previousProfile) => ({ ...previousProfile, ...changes }))
  }

  return (
    <div className="utility-profile-card">
      <p className="data-list-label">PARTIAL UPDATE</p>
      <h3>현재 닉네임: {profile.name}</h3>
      <p>{profile.email}</p>
      <p>{profile.bio}</p>
      <button type="button" onClick={() => handleUpdate({ name: 'React Expert' })}>닉네임만 업데이트</button>
    </div>
  )
}
