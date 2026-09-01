import type { User } from '../type/user';

interface UserProfileProps {
    user:User;
}

export function UserProfile({user}:UserProfileProps) {

  return(
    <div style={{
      padding: '20px',
      border: '2px solid #646cff',
      borderRadius: '12px',
      backgroundColor: '#f9f9f9',
      boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
    }}>
      <h3 style={{ margin: 0, color: '#333' }}>👤 엔지니어 프로필</h3>
      <p style={{ fontSize: '1.2rem', margin: '15px 0' }}>
        성함: <strong>{user.displayName.toUpperCase()}</strong>
      </p>
      <code style={{ color: '#666', backgroundColor: '#eee', padding: '2px 5px' }}>
        ID Tag: {user.id}
      </code>
    </div>
  );
}