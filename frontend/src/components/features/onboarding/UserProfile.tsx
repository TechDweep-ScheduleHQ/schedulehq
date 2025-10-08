import type React from "react"
import { Button } from "@mui/material"
import type { Dispatch , SetStateAction } from "react";

interface UserProfileProps {
  currentStep: number
  bio: string;
  setBio: Dispatch<SetStateAction<string>>;
  profilePhotoUrl: string;
  setProfilePhotoUrl: Dispatch<SetStateAction<string>>;
  onNext: () => void
}

const UserProfile: React.FC<UserProfileProps> = ({ onNext ,bio , setBio , profilePhotoUrl , setProfilePhotoUrl}) => {

  return (
    <div className="text-left px-8 m-5 rounded-lg max-w-2xl mx-auto">
      <div>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-[var(--input-bg)] rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-[var(--lightGray-text)]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <button className="text-sm text-[var(--lightGray-text)] transition-colors">Add profile photo</button>
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-[var-(--primary-text)]">Profile Photo URL</label>
          <input
            type="text"
            value={profilePhotoUrl}
            onChange={(e) => setProfilePhotoUrl(e.target.value)}
            className="w-full p-2 bg-[var(--card-bg)] rounded border border-[var(--borderGray-bg)]"
            placeholder="https://example.com/photo.jpg"
          />
        </div>

        <div className="text-left">
          <label className="block mb-2 text-sm font-medium text-[var-(--primary-text)]">About</label>
          <div className="bg-[var(--card-bg)] rounded-lg border border-[var(--borderGray-bg)] focus-within:border-gray-600">

            <textarea
              className="w-full p-3 bg-transparent text-[var-(--primary-text)]  focus:outline-none resize-none"
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
          <p className="mt-2 mb-2 text-sm text-[var(--lightGray-text)]">
            A few sentences about yourself. This will appear on your scheduling link.
          </p>
        </div>

        <Button
          variant="contained"
          onClick={onNext}
          fullWidth
          sx={{
            py: 1.5,
            mt: 4,
            backgroundColor: 'var(--primary-text)',
            color: 'var(--primary-bg)',
            fontWeight: 600,
            fontSize: "0.95rem",
            textTransform: "none",
            borderRadius: "8px",
            "&:hover": {
              backgroundColor: 'var(--button-hover-bg)'
            },
          }}
        >
          Finish setup and get started →
        </Button>
      </div>
    </div>
  )
}

export default UserProfile
