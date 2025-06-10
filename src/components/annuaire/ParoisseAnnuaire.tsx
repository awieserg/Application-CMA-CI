import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Phone, Mail, User, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

// Mock data remains the same
const mockMembres = [
  {
    fullName: "Kouassi Jean Marc",
    role: "Ancien",
    phones: ["+225 07 11 22 33 44", "+225 05 11 22 33 44"],
    email: "kouassi.jm@mail.com"
  },
  {
    fullName: "Diallo Aminata",
    role: "Diaconesse",
    phones: ["+225 05 22 33 44 55"],
    email: null
  }
];

export const ParoisseAnnuaire = () => {
  const [searchName, setSearchName] = useState("");

  const filteredMembres = mockMembres.filter(membre => 
    membre.fullName.toLowerCase().includes(searchName.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Annuaire de la Paroisse</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead><User className="w-4 h-4 mr-2 inline" />Nom Complet</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead><Phone className="w-4 h-4 mr-2 inline" />Contacts</TableHead>
              <TableHead><Mail className="w-4 h-4 mr-2 inline" />Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembres.map((membre, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{membre.fullName}</TableCell>
                <TableCell>{membre.role}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {membre.phones.map((phone, idx) => (
                      <div key={idx}>{phone}</div>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{membre.email || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
