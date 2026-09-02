using System;
using System.Collections.Generic;
using UnityEngine;

namespace NoWayOut.Inventory
{
    [Serializable] public sealed class InventoryStack { public string itemId; public int quantity; public InventoryStack(string id, int qty){itemId=id;quantity=qty;} }
    public sealed class BackpackInventoryRuntime : MonoBehaviour
    {
        [SerializeField] int maxSlots = 24;
        [SerializeField] int maxWeight = 30;
        readonly List<InventoryStack> stacks = new();
        public IReadOnlyList<InventoryStack> Stacks => stacks;
        public int MaxSlots => maxSlots;
        public int MaxWeight => maxWeight;
        public event Action Changed;
        public bool Add(string itemId, int quantity, int perStack = 10, int itemWeight = 1)
        {
            if (string.IsNullOrWhiteSpace(itemId) || quantity <= 0 || CurrentWeight + quantity * itemWeight > maxWeight) return false;
            int remaining=quantity;
            foreach(var s in stacks) if(s.itemId==itemId && s.quantity<perStack){ int add=Mathf.Min(remaining,perStack-s.quantity); s.quantity+=add; remaining-=add; if(remaining==0){Changed?.Invoke();return true;} }
            while(remaining>0){ if(stacks.Count>=maxSlots) return false; int add=Mathf.Min(remaining,perStack); stacks.Add(new InventoryStack(itemId,add)); remaining-=add; }
            Changed?.Invoke(); return true;
        }
        public bool Remove(string itemId,int quantity){ if(quantity<=0)return false; int total=0;foreach(var s in stacks)if(s.itemId==itemId)total+=s.quantity;if(total<quantity)return false;int rem=quantity;for(int i=stacks.Count-1;i>=0&&rem>0;i--)if(stacks[i].itemId==itemId){int take=Mathf.Min(rem,stacks[i].quantity);stacks[i].quantity-=take;rem-=take;if(stacks[i].quantity==0)stacks.RemoveAt(i);}Changed?.Invoke();return true; }
        public int Count(string itemId){int n=0;foreach(var s in stacks)if(s.itemId==itemId)n+=s.quantity;return n;}
        public int CurrentWeight { get { int n=0; foreach(var s in stacks)n+=s.quantity; return n; } }
    }
}
