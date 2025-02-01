import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface ToxicityResultProps {
  criterion: string;
  value: number;
}

export default function ToxicityResult({
  criterion,
  value,
}: ToxicityResultProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          a<span className="font-medium">{criterion}</span>
          {value > 50 ? (
            <AlertCircle className="text-red-500" />
          ) : (
            <CheckCircle2 className="text-green-500" />
          )}
        </div>
        <Progress value={value} className="h-2" />
        <span className="text-sm text-gray-500">
          {value.toFixed(1)}% detected
        </span>
      </CardContent>
    </Card>
  );
}
