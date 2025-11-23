import { useState } from "react";
import { useAuth } from "@Contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@Components/Shadcn/dialog";
import { Button } from "@Components/Shadcn/button";
import { Input } from "@Components/Shadcn/input";
import { Label } from "@Components/Shadcn/label";
import { Avatar, AvatarFallback, AvatarImage } from "@Components/Shadcn/avatar";
import { Upload, Phone, AlertCircle } from "lucide-react";

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileDialog({ open, onOpenChange }: ProfileDialogProps) {
  const { profile, updateProfile } = useAuth();
  const [displayName, setDisplayName] = useState(profile?.display_name || "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
  const [phoneNumber, setPhoneNumber] = useState(profile?.phone_number || "");
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  // Validare simplă pentru număr de telefon
  const validatePhoneNumber = (phone: string): boolean => {
    if (!phone) return true; // Opțional, deci gol e OK

    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, "");

    // Validăm că numărul poate fi normalizat la formatul 407[restul]
    // Formatul final trebuie să fie 407 urmat de 9 cifre (total 12 cifre)
    // Acceptăm și formatele care pot fi normalizate (07..., +407..., etc.)

    // Dacă deja începe cu 40, verificăm că are exact 12 cifre
    if (cleaned.startsWith("40")) {
      return cleaned.length === 11;
    }

    // Dacă începe cu 07, verificăm că are 10 cifre (07 + 9 cifre)
    if (cleaned.startsWith("07")) {
      return cleaned.length === 10;
    }

    // Dacă începe cu 7 și are 9 cifre, e valid (va fi normalizat la 407...)
    if (cleaned.startsWith("7") && cleaned.length === 9) {
      return true;
    }

    // Dacă începe cu 40, verificăm că are cel puțin 10 cifre
    if (cleaned.startsWith("40")) {
      // Dacă urmează 7, trebuie să aibă 12 cifre (407 + 9)
      if (cleaned.length >= 3 && cleaned[2] === "7") {
        return cleaned.length === 12;
      }
      // Altfel, verificăm că are suficiente cifre pentru a forma un număr valid
      return cleaned.length >= 10;
    }

    // Pentru alte formate, verificăm că are între 9 și 12 cifre
    // (va fi normalizat la 407...)
    return cleaned.length >= 9 && cleaned.length <= 12;
  };

  const formatPhoneNumber = (phone: string): string => {
    // Remove all non-digits
    let cleaned = phone.replace(/\D/g, "");

    // Dacă e gol, returnează gol
    if (!cleaned) return "";

    // Dacă deja începe cu 40, păstrează formatul
    if (cleaned.startsWith("40")) {
      return cleaned;
    }

    // Dacă începe cu 07, elimină 0 și adaugă 40 înainte → 407...
    if (cleaned.startsWith("07")) {
      return "40" + cleaned.substring(1);
    }

    // Dacă începe cu 7 și are 9 cifre (număr românesc fără prefix), adaugă 40
    if (cleaned.startsWith("7") && cleaned.length === 9) {
      return "40" + cleaned;
    }

    // Dacă începe cu 40, verifică dacă urmează 7
    if (cleaned.startsWith("40")) {
      // Dacă a doua cifră după 40 este 7, păstrează (deja e 407...)
      if (cleaned.length >= 3 && cleaned[2] === "7") {
        return cleaned;
      }
      // Altfel, adaugă 7 după 40 → 407...
      return "407" + cleaned.substring(2);
    }

    // Pentru orice alt caz, adaugă 407 înainte
    // (presupunem că e un număr românesc fără prefix)
    return "407" + cleaned;
  };

  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);
    setPhoneError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validare telefon dacă e completat
    if (phoneNumber && !validatePhoneNumber(phoneNumber)) {
      setPhoneError("Format invalid. Folosește formatul: 40712345678");
      return;
    }

    try {
      setLoading(true);

      const formattedPhone = phoneNumber ? formatPhoneNumber(phoneNumber) : "";

      await updateProfile({
        display_name: displayName,
        avatar_url: avatarUrl,
        phone_number: formattedPhone || undefined, // Save as null if empty
      });

      onOpenChange(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] glass-card border-white/20">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="bg-blue-500 text-white text-2xl">
                {displayName?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>

            <div className="w-full space-y-2">
              <Label htmlFor="avatar">Avatar URL</Label>
              <div className="flex gap-2">
                <Input
                  id="avatar"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                />
                <Button type="button" size="icon" variant="outline">
                  <Upload className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Paste an image URL or upload to an image host
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Display Name</Label>
            <Input
              id="name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={profile?.email} disabled className="bg-white/5" />
            <p className="text-xs text-gray-500">Email cannot be changed</p>
          </div>

          {/* Phone Number Field */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Phone Number (Optional)
            </Label>
            <Input
              id="phone"
              type="tel"
              value={phoneNumber}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="40712345678 sau 0712345678"
              className={phoneError ? "border-red-500" : ""}
            />
            {phoneError && (
              <p className="text-xs text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {phoneError}
              </p>
            )}
            <p className="text-xs text-gray-500">
              Format: +40712345678 sau 0712345678
            </p>
          </div>

          {/* WhatsApp Feature Disclaimer */}
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-400">
                  WhatsApp Integration (Coming Soon)
                </p>
                <p className="text-xs text-gray-400">
                  Adaugă numărul de telefon pentru a putea crea task-uri prin
                  WhatsApp bot în viitor. Fără număr de telefon, această
                  funcționalitate nu va fi disponibilă.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
